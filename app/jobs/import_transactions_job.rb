# frozen_string_literal: true

class ImportTransactionsJob < ApplicationJob
  queue_as :import_transactions

  attr_reader :import_transaction

  def perform(import_transaction_id)
    @import_transaction = ImportTransaction.find(import_transaction_id)

    import_with_timings { Transactions::ImportService.call(import_transaction) }
  rescue Exceptions::CompletedWithErrors => _e
    update_import_transaction(ended_at: Time.zone.now, status: :finished_with_errors)
  rescue StandardError => e
    handle_error(e)
  ensure
    Fund.find_each(&:refresh)
  end

  private

  def import_with_timings
    update_import_transaction(started_at: Time.zone.now, status: :running)

    yield

    update_import_transaction(ended_at: Time.zone.now, status: :finished)
  end

  def handle_error(error)
    update_import_transaction(ended_at: Time.zone.now, status: :failed,
                              error_message: "#{error.class}: #{error.message} #{error.backtrace.join("\n")}")

    Rails.logger.error("[ImportTransactionsJob] #{error.class}: #{error.message}")
    Rails.logger.error(error.backtrace.join("\n"))
  end

  def update_import_transaction(*attributes)
    import_transaction.update!(*attributes)
  end
end
