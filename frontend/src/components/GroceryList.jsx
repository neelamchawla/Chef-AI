import { ShoppingCart, Package } from 'lucide-react';

function GrocerySection({ title, items, icon: Icon, variant }) {
  if (!items?.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className={variant === 'available' ? 'text-sage-500' : 'text-terracotta-500'} />
        <h3 className="text-sm font-semibold text-sage-800">{title}</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item, idx) => (
          <div
            key={`${item.item || item.name}-${idx}`}
            className={`rounded-xl border p-3 ${
              variant === 'available'
                ? 'border-sage-200 bg-sage-50/50'
                : 'border-terracotta-200/50 bg-cream-50'
            }`}
          >
            <p className="font-medium text-sage-900">{item.item || item.name}</p>
            <p className="mt-1 text-sm text-sage-600">
              {item.quantity} {item.unit}
              {item.estimated_price != null && ` · ₹${item.estimated_price}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GroceryList({ groceryList }) {
  if (!groceryList) return null;

  const needToBuy = groceryList.need_to_buy || groceryList.needToBuy || [];
  const alreadyAvailable = groceryList.already_available || groceryList.alreadyAvailable || [];
  const totalCost = groceryList.total_estimated_cost ?? groceryList.totalEstimatedCost;

  return (
    <section className="card">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} className="text-sage-600" />
          <h2 className="font-display text-xl font-bold text-sage-900">Grocery List</h2>
        </div>
        {totalCost != null && (
          <span className="text-sm font-semibold text-sage-700">
            Total: ₹{totalCost}
          </span>
        )}
      </div>

      <div className="space-y-6">
        <GrocerySection
          title="Need to Buy"
          items={needToBuy}
          icon={ShoppingCart}
          variant="buy"
        />
        <GrocerySection
          title="Already Available"
          items={alreadyAvailable}
          icon={Package}
          variant="available"
        />
      </div>
    </section>
  );
}
