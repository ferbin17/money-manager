class CreateFunds < ActiveRecord::Migration[7.1]
  def change
    create_table :funds do |t|
      t.string :name, null: false
      t.integer :fund_type, default: 0 # 0: MF, 1: FD, 2: RD
      t.integer :subtype, default: 0 # 0: Hybrid, 1: ELSS, 2: Debt, 3: Equity
      t.integer :status, default: 0 # 0: Active, 1: Withdrawn
      t.decimal :total_investment, precision: 15, scale: 2, default: 0.0
      t.decimal :current_value, precision: 15, scale: 2, default: 0.0
      t.decimal :current_nav, precision: 10, scale: 4, default: 0.0
      t.boolean :deleted, default: false
      t.references :asset_house, null: false, foreign_key: true

      t.timestamps
    end
  end
end
