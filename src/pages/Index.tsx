import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Wrench, Shield, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
    loadCart();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .limit(3);

    if (data) setFeaturedProducts(data);
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem("pataspace-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem("pataspace-cart", JSON.stringify(newCart));

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Engineering Tools & Equipment
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Discover precision instruments, power tools, and industrial equipment trusted by professionals worldwide.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Grade</h3>
              <p className="text-muted-foreground">
                Industrial-quality tools built to last
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safety Certified</h3>
              <p className="text-muted-foreground">
                All products meet industry standards
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-secondary-foreground rounded-full mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick shipping on all orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Explore our most popular engineering tools
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
