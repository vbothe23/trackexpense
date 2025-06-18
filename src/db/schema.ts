import { appSchema, tableSchema } from "@nozbe/watermelondb"

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'key', type: 'string', isIndexed: true }, // Unique label, indexed for performance
        { name: 'display_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'subcategories',
      columns: [
        { name: 'key', type: 'string', isIndexed: true }, // Unique label, indexed for performance
        { name: 'display_name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true },
        // Stored as Unix timestamp (milliseconds) for efficient sorting and storage
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'payment_modes',
      columns: [
        { name: 'key', type: 'string', isIndexed: true }, // Unique label, indexed for performance
        { name: 'display_name', type: 'string' },
        // Stored as Unix timestamp (milliseconds) for efficient sorting and storage
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'date', type: 'string', isIndexed: true }, // ISO 8601 string for expense date
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'subcategory_id', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'payment_mode_id', type: 'string', isIndexed: true },
        { name: 'notes', type: 'string' },
        // Stored as Unix timestamp (milliseconds) for efficient sorting and storage
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
})
