# frozen_string_literal: true

module Transactions
  module ImportHelper
    BUY_DESCRIPTIONS = ["Systematic Investment", "Purchase", "Lateral Shift in"].freeze
    SELL_DESCRIPTIONS = ["Redemption", "Lateral Shift Out"].freeze
    TRANSACTION_HEADERS = %i[name description date nav units amount].freeze

    private

    #################################
    # Parse Transaction Header & Row
    def parse_transaction_headers(header_row)
      TRANSACTION_HEADERS.to_h do |header|
        index = header_row.index { |col| col.to_s.downcase.include?(header.to_s) }

        [header, index]
      end
    end

    def parse_transaction_row(transaction_headers, row)
      transaction_headers.each_with_object({}) do |(header, index), attrs|
        attribute, value = parse_field(header, row[index])
        attrs[attribute] = value
      end
    end

    def find_transaction_header(rows)
      header_row = nil

      loop do
        if rows.empty? || rows[0][0] == "Scheme Name"
          header_row = rows.shift
          break
        else
          rows.shift
        end
      end

      header_row
    end
    #################################

    #################################
    # Parse Field Name-Value Pair
    def parse_field(header, value)
      return [header, value] unless header.in?(%i[name date])

      send("parse_#{header}_field", value)
    end

    def parse_name_field(raw_name)
      fund_name = parse_fund_name(raw_name)
      fund_id = fund(fund_name)&.id

      [:fund_id, fund_id]
    end

    def parse_date_field(raw_date)
      [:transaction_date, Date.strptime(raw_date, "%d-%b-%Y")]
    end
    #################################

    #################################
    # Parse Fund & Asset House Name
    def parse_fund_name(full_name)
      full_name.split("(").first
               .strip
               .gsub(/\s+Option.*$/, "")
               .strip
    end

    def parse_asset_house_name(fund_name)
      fund_name.split("Fund").first&.strip
    end

    def fund(_)
      raise "Implement fund method in base class"
    end
    #################################

    #################################
    # Parse Transaction Type
    def parse_transaction_type(description)
      normalized_description = description.downcase

      return :buy if BUY_DESCRIPTIONS.any? { |w| normalized_description.include?(w.downcase) }
      return :sell if SELL_DESCRIPTIONS.any? { |w| normalized_description.include?(w.downcase) }
      return :cancelled if normalized_description.include?("Cancelled".downcase)

      :other
    end
    #################################
  end
end
