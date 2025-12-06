# frozen_string_literal: true

class ImportTransaction < ApplicationRecord
  has_one_attached :file

  enum :status, {
    pending: 0,
    running: 1,
    finished: 2,
    failed: 3,
    finished_with_errors: 4
  }

  validates :date, :status, presence: true

  after_create_commit :queue_import_job

  private

  def queue_import_job
    ImportTransactionsJob.perform_now(id)
  end
end
