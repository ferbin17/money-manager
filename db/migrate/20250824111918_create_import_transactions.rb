class CreateImportTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :import_transactions do |t|
      t.date :date
      t.datetime :started_at
      t.datetime :ended_at
      t.integer :status, default: 0
      t.text :error_message
      t.timestamps
    end
  end
end
