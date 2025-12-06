# frozen_string_literal: true

class TransactionsController < ApplicationController
  include ItemCrudable

  def index
    @transactions = Transaction.includes(:fund)
  end

  def new
    @transaction = Transaction.new
  end

  def import
    if params[:file].present?
      ImportTransaction.create(date: Time.zone.now, file: params[:file])
      render json: { success: true, message: "Import completed successfully!" }
    else
      render json: { success: false, message: "No file provided" }
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:description, :nav, :units, :amount, :transaction_type, :transaction_date,
                                        :reference_number, :notes, :status)
  end
end
