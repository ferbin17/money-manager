# frozen_string_literal: true

module SoftDeletable
  extend ActiveSupport::Concern

  included do
    default_scope { active }

    scope :active, -> { where(deleted: false) }
    scope :deleted, -> { where(deleted: true) }

    def soft_delete
      run_callbacks(:soft_delete) do
        update(deleted: true)
      end
    end

    # Define the callback methods
    define_callbacks :soft_delete
  end

  class_methods do
    def before_soft_delete(*args, &block)
      set_callback :soft_delete, :before, *args, &block
    end
  end
end
