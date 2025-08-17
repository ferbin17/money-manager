class CreateAssetHouses < ActiveRecord::Migration[7.1]
  def change
    create_table :asset_houses do |t|
      t.string :name, null: false
      t.string :description
      t.boolean :deleted, default: false

      t.timestamps
    end
  end
end
