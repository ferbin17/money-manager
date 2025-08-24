class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.string :description
      t.decimal :nav, precision: 15, scale: 2
      t.decimal :units, precision: 15, scale: 2
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.integer :transaction_type, default: 0
      t.date :transaction_date, null: false
      t.string :reference_number
      t.text :notes
      t.integer :status, default: 0
      t.boolean :deleted, default: false
      t.timestamps
    end
    
    add_index :transactions, :transaction_date
    add_index :transactions, :transaction_type
    add_index :transactions, :status
  end
end
