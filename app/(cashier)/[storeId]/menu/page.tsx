import CartButton from "@/components/button/cart-btn";
import ContainerCardMenu from "@/components/card/container-card-menu";
import ContainerCategoryCard from "@/components/card/container-category-card";
import FilterSearchMenu from "@/components/filter/menu/filter-search-menu";

const CashierMenuPage = () => {
  return (
    <div className="px-4">
      <div className="flex justify-between gap-4">
        <div className="w-full">
          <FilterSearchMenu />
        </div>
        <CartButton />
      </div>
      <ContainerCategoryCard />
      <ContainerCardMenu />
    </div>
  );
};

export default CashierMenuPage;
