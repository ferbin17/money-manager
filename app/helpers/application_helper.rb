module ApplicationHelper
  def currencies
    @currencies ||= [
      { name: "Indian Rupee (INR)", code: "INR", symbol: "₹" },
      { name: "US Dollar (USD)", code: "USD", symbol: "$" },
      { name: "Euro (EUR)", code: "EUR", symbol: "€" },
      { name: "British Pound (GBP)", code: "GBP", symbol: "£" },
      { name: "Japanese Yen (JPY)", code: "JPY", symbol: "¥" }
    ]
  end

  def navigation_items
    @navigation_items ||= [
      { title: "Dashboard", path: root_path },
      { title: "Funds", path: funds_path },
      { title: "Asset Houses", path: asset_houses_path },
      { title: "Transactions", path: "#" },
      { title: "Reports", path: "#" },
      { title: "Budget", path: "#" },
      { title: "Settings", path: "#" }
    ]
  end
end
