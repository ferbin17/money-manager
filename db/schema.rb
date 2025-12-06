# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_24_115340) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "asset_houses", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.boolean "deleted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "funds", force: :cascade do |t|
    t.string "name", null: false
    t.integer "fund_type", default: 0
    t.integer "subtype", default: 0
    t.integer "status", default: 0
    t.decimal "total_investment", precision: 15, scale: 2, default: "0.0"
    t.decimal "current_value", precision: 15, scale: 2, default: "0.0"
    t.decimal "current_nav", precision: 10, scale: 4, default: "0.0"
    t.boolean "deleted", default: false
    t.bigint "asset_house_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["asset_house_id"], name: "index_funds_on_asset_house_id"
  end

  create_table "goals", force: :cascade do |t|
    t.string "name", null: false
    t.decimal "target_amount", precision: 15, scale: 2, default: "0.0"
    t.date "target_date"
    t.decimal "current_amount", precision: 15, scale: 2, default: "0.0"
    t.integer "status", default: 0
    t.boolean "deleted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "import_transactions", force: :cascade do |t|
    t.date "date"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.integer "status", default: 0
    t.text "error_message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.string "description"
    t.decimal "nav", precision: 15, scale: 2
    t.decimal "units", precision: 15, scale: 2
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.integer "transaction_type", default: 0
    t.date "transaction_date", null: false
    t.string "reference_number"
    t.text "notes"
    t.integer "status", default: 0
    t.boolean "deleted", default: false
    t.bigint "fund_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fund_id"], name: "index_transactions_on_fund_id"
    t.index ["status"], name: "index_transactions_on_status"
    t.index ["transaction_date"], name: "index_transactions_on_transaction_date"
    t.index ["transaction_type"], name: "index_transactions_on_transaction_type"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "funds", "asset_houses"
  add_foreign_key "transactions", "funds"
end
