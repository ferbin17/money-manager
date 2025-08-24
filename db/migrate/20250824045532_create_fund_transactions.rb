class CreateFundTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :fund_transactions do |t|
      t.references :fund, null: false, foreign_key: true
      t.references :transaction, null: false, foreign_key: true
      t.timestamps
    end
  end
end
