import React, { useState, useEffect } from "react";
import { PropertyCard } from "@/components/AdminPannel/properties/PropertyCard";
import { FloatingActionButton } from "@/components/AdminPannel/ui/UIComponents";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/AdminPannel/ui/pagination";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/AdminPannel/ui/popover";
import { Label } from "@/components/AdminPannel/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/AdminPannel/ui/select";
import { Slider } from "@/components/AdminPannel/ui/slider";
import { PropertyFormDialog } from "@/components/AdminPannel/properties/PropertyFormDialog";

const CATEGORIES = ["All", "Rent", "Buy", "Off Plan", "Commercial for Rent", "Commercial for Buy"];

const MOCK_PROPERTIES = [
  {
    id: "p1",
    title: "Modern Waterfront Villa",
    address: "123 Palm Jumeirah, Dubai",
    price: "$1,250,000",
    priceValue: 1250000,
    type: "Buy",
    bedrooms: 4,
    bathrooms: 5,
    area: "3,500 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
    location: "Palm Jumeirah"
  },
  {
    id: "p2",
    title: "Luxury Downtown Apartment",
    address: "Dubai Downtown, Burj Area",
    price: "$3,500/month",
    priceValue: 3500,
    type: "Rent",
    bedrooms: 2,
    bathrooms: 2.5,
    area: "1,200 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    location: "Downtown"
  },
  {
    id: "p3",
    title: "Commercial Office Space",
    address: "Business Bay, Dubai",
    price: "$450,000",
    priceValue: 450000,
    type: "Commercial for Buy",
    bedrooms: 0,
    bathrooms: 2,
    area: "2,100 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
    location: "Business Bay"
  },
  {
    id: "p4",
    title: "Off-Plan Townhouse",
    address: "Damac Hills, Dubai",
    price: "$850,000",
    priceValue: 850000,
    type: "Off Plan",
    bedrooms: 3,
    bathrooms: 3.5,
    area: "2,800 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
    location: "Damac Hills"
  },
  {
    id: "p5",
    title: "Beachfront Apartment",
    address: "JBR, Dubai Marina",
    price: "$5,000/month",
    priceValue: 5000,
    type: "Rent",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,000 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    location: "Dubai Marina"
  },
  {
    id: "p6",
    title: "Villa with Private Pool",
    address: "Emirates Hills, Dubai",
    price: "$3,500,000",
    priceValue: 3500000,
    type: "Buy",
    bedrooms: 6,
    bathrooms: 7,
    area: "6,500 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
    location: "Emirates Hills"
  },
  {
    id: "p7",
    title: "Retail Space for Lease",
    address: "Dubai Mall, Downtown Dubai",
    price: "$12,000/month",
    priceValue: 12000,
    type: "Commercial for Rent",
    bedrooms: 0,
    bathrooms: 2,
    area: "1,800 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1604328471151-b52226907017?w=800&auto=format&fit=crop",
    location: "Downtown"
  },
];

const LOCATIONS = [...new Set(MOCK_PROPERTIES.map(property => property.location))];

const PropertiesPage = () => {
   
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 4000000]);
  const itemsPerPage = 6;

  useEffect(() => {
    const handleSearch = (event) => {
      setSearchQuery(event.detail);
      setCurrentPage(1);
    };

    window.addEventListener('search', handleSearch);
    return () => window.removeEventListener('search', handleSearch);
  }, []);

  const filteredProperties = MOCK_PROPERTIES
    .filter(property => selectedCategory === "All" || property.type === selectedCategory)
    .filter(property =>
      !searchQuery ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(property => selectedLocation === "all" || property.location === selectedLocation)
    .filter(property => property.priceValue >= priceRange[0] && property.priceValue <= priceRange[1]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProperty = () => {
    alert("Add property form would open here");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  

  return (
    
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4 sm:mb-0">Properties ({filteredProperties.length})</h2>

          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
                  <Filter size={16} className="mr-2" />
                  Filters
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="all">Any location</SelectItem>
                        {LOCATIONS.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Price Range</Label>
                      <div className="text-sm font-medium">
                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                      </div>
                    </div>
                    <Slider
                      defaultValue={[0, 4000000]}
                      max={4000000}
                      step={100000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value)}
                      className="py-4"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="bg-white p-1 rounded-lg shadow-sm inline-flex mb-6 border border-gray-200 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {currentProperties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700">No properties found</h3>
            <p className="text-gray-500 mt-1">Try changing your filter or add new properties.</p>
          </div>
        )}

        {filteredProperties.length > 0 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <FloatingActionButton
        label="Add Property"
        onClick={handleAddProperty}
      />
    </div>
  );
};

export default PropertiesPage;
