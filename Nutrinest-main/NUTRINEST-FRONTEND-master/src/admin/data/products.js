import almondsImg from "../../assets/almonds.png";
import cashewsImg from "../../assets/cashews.png";
import walnutsImg from "../../assets/walnuts.png";

export const initialProducts = [
  {
    id: 1,
    name: "California Almonds (200g)",
    category: "Dry Fruits",
    price: 450,
    stock: 100,
    image: almondsImg,
    status: "Active",
  },
  {
    id: 2,
    name: "Premium Cashews (200g)",
    category: "Dry Fruits",
    price: 380,
    stock: 100,
    image: cashewsImg,
    status: "Active",
  },
  {
    id: 3,
    name: "Walnut Kernels (200g)",
    category: "Dry Fruits",
    price: 650,
    stock: 100,
    image: walnutsImg,
    status: "Active",
  },
];
