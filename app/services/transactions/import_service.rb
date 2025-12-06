# frozen_string_literal: true

require "csv"

module Transactions
  class ImportService
    include Callable
    include Transactions::ImportHelper

    attr_reader :import_transaction, :errored

    def initialize(import_transaction)
      @import_transaction = import_transaction
      @errored = false
    end

    def call
      transactions_attributes = build_transactions_attributes
      transactions_attributes.map! do |transaction_attributes|
        add_transaction_type_attribute(transaction_attributes)
      end

      result = Transaction.import(transactions_attributes)
      return unless result.failed_instances.any?

      @errored = errored || true
      Transaction.import(transactions_attributes, validate: false)

      raise Exceptions::CompletedWithErrors if errored
    end

    private

    def build_transactions_attributes
      header_row = find_transaction_header(csv_rows)
      transaction_headers = parse_transaction_headers(header_row)

      csv_rows.map { |row| parse_transaction_row(transaction_headers, row) }
    end

    def add_transaction_type_attribute(transaction_attributes)
      transaction_type = parse_transaction_type(transaction_attributes[:description])
      transaction_attributes[:transaction_type] = Transaction.transaction_types[transaction_type]

      transaction_attributes
    end

    def fund(name)
      @funds ||= {}

      asset_house_name = parse_asset_house_name(name)
      @funds[name] ||= begin
        fund_created = Fund.find_or_create_by(name: name, asset_house_id: asset_houses[asset_house_name]&.id)
        unless fund_created.valid?
          @errored = errored || true
          fund_created.save(validate: false)
        end

        fund_created
      end
    end

    def csv_rows
      @csv_rows ||= CSV.parse(import_transaction.file.download.force_encoding("UTF-8"))
    end

    def asset_houses
      @asset_houses ||= AssetHouse.all.index_by(&:name)
    end
  end
end
