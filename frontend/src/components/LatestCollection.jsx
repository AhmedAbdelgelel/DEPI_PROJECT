import React, { useEffect, useState ,useContext } from 'react'
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";



const LatestCollection = () => {

    const {products} = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([])
    
    useEffect(() => {
        setLatestProducts(products.slice(0,10))
    }, [])
    

  return (
    <div className="my-10">
        <div className="text-center py-8 text-3xl">
            <Title text1={"LATEST"} text2={"COLLECTIONS"}/>
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ipsa voluptatem placeat, dolore facere cum! Ipsum laboriosam suscipit, dolor natus eveniet neque delectus ratione nostrum officiis? Ab aliquam ea cupiditate.
            </p>
        </div>
        {/* Rendering Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {
                latestProducts.map((item,index)=>{
                    return (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    );
                })
                
                
            }
            
        </div>
    </div>
  )
}

export default LatestCollection;