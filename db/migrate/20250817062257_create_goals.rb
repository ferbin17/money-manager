class CreateGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :goals do |t|
      t.string :name, null: false
      t.decimal :target_amount, precision: 15, scale: 2, default: 0.0
      t.date :target_date
      t.decimal :current_amount, precision: 15, scale: 2, default: 0.0
      t.integer :status, default: 0
      t.boolean :deleted, default: false

      t.timestamps
    end
  end
end
