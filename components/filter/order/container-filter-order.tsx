import { FilterSearchOrder } from "../filter-search";
import PopoverFilter from "../popover-filter";
import { ContainerFilterOrderDate, FilterOrderStatus } from "./filter-order";
import FilterOrderButton from "./filter-order-button";

const ContainerFilterOrder = () => {
  return (
    <div className="container-filter">
      {/* Desktop */}
      <div className="container-filter-desktop">
        <FilterSearchOrder
          placeholder="Cari no pesanan disini..."
          className="w-[30vw]"
        />
        <FilterOrderStatus />
        <ContainerFilterOrderDate />
        <FilterOrderButton />
      </div>
      {/* Desktop */}
      <div className="container-filter-title">
        <div className="container-filter-mobile">
          <PopoverFilter>
            <h4>Filter Pesanan</h4>
            <FilterSearchOrder
              placeholder="Cari disini..."
              className="w-full"
            />
            <FilterOrderStatus />
            <ContainerFilterOrderDate />
            <FilterOrderButton />
          </PopoverFilter>
        </div>
      </div>
    </div>
  );
};

export default ContainerFilterOrder;
