import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/AdminPannel/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/AdminPannel/ui/form";
import { Input } from "@/components/AdminPannel/ui/input";
import { Textarea } from "@/components/AdminPannel/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/AdminPannel/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/AdminPannel/ui/select";


// Common schema fields for all property types
const basePropertySchema = {
  propertyTitle: z.string().min(5, "Title must be at least 5 characters"),
  propertyDescription: z.string().min(20, "Description must be at least 20 characters"),
  propertyAddress: z.string().min(5, "Address is required"),
  propertyCountry: z.string().min(1, "Country is required"),
  propertyState: z.string().min(1, "State is required").refine(val => val !== "None", {
    message: "Please select a valid state"
  }), // 👈 Line 44  propertyZip: z.string().min(1, "ZIP code is required"),
  propertyFeaturedImage: z.string().min(1, "Featured image is required"),
  media: z.array(z.string()).optional(),
  
  propertyType: z.string().min(1, "Property type is required"),
  propertyPrice: z.coerce.number().positive("Price must be positive"),
  brokerFee: z.coerce.number().min(1, "Broker fee must be at least 1"), 
  propertySize: z.coerce.number().positive("Size must be positive"),
  propertyRooms: z.coerce.number().int().positive("Number of rooms must be positive"),
  propertyBedrooms: z.coerce.number().int().positive("Number of bedrooms must be positive"),
  propertyKitchen: z.coerce.number().int().positive("Number of kitchens must be positive"),
  propertyBathrooms: z.coerce.number().positive("Number of bathrooms must be positive"),
  
  dldPermitNumber: z.string().min(1, "DLD permit number is required"),
  agent: z.string().min(1, "Agent is required"),
  dldQrCode: z.string().min(1, "DLD QR code is required"),
  
  latitude: z.coerce.number().refine(val => val !== 0, "Invalid coordinates"), 
  longitude: z.coerce.number().refine(val => val !== 0, "Invalid coordinates"), 
  
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
};

// Category-specific schema extensions
const buyPropertySchema = z.object({
  ...basePropertySchema,
  numberOfCheques: z.coerce.number().int().min(1, "Number of cheques must be at least 1"),
});

const rentPropertySchema = z.object({
  ...basePropertySchema,
  numberOfCheques: z.coerce.number().int().min(1, "Number of cheques must be at least 1"),
  roiPercentage: z.coerce.number().min(0, "ROI percentage cannot be negative"),
});

const offPlanPropertySchema = z.object({
  ...basePropertySchema,
  completionDate: z.string().min(1, "Completion date is required"),
  paymentPlan: z.string().min(1, "Payment plan is required"),
  developer: z.string().min(1, "Developer is required"),
});

const commercialPropertySchema = z.object({
  ...basePropertySchema,
  numberOfCheques: z.coerce.number().int().min(1, "Number of cheques must be at least 1"),
  commercialType: z.string().min(1, "Commercial type is required"),
});

// Mock agents data, replace with API call in a real implementation
const mockAgents = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Ahmed Ali" },
];

// Property types
const propertyTypes = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Duplex", 
  "Studio", "Office", "Retail", "Warehouse", "Land"
];

// Commercial types
const commercialTypes = [
  "Office", "Retail", "Warehouse", "Industrial", 
  "Shop", "Showroom", "Land", "Hotel"
];

export const PropertyForm = ({ category, onSubmit, onCancel }) => {
  // Select the appropriate schema based on category
  let formSchema;
  switch (category) {
    case "Buy":
      formSchema = buyPropertySchema;
      break;
    case "Rent":
      formSchema = rentPropertySchema;
      break;
    case "Off Plan":
      formSchema = offPlanPropertySchema;
      break;
    case "Commercial for Buy":
    case "Commercial for Rent":
      formSchema = commercialPropertySchema;
      break;
    default:
      formSchema = buyPropertySchema;
  }

  // Set up form with the selected schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyTitle: "",
      propertyDescription: "",
      propertyAddress: "",
      propertyCountry: "",
      propertyState: "",
      propertyZip: "",
      propertyFeaturedImage: "",
      propertyType: "",
      propertyPrice: 0,
      brokerFee: 0,
      propertySize: 0,
      propertyRooms: 0,
      propertyBedrooms: 0,
      propertyKitchen: 0,
      propertyBathrooms: 0,
      dldPermitNumber: "",
      agent: "",
      dldQrCode: "",
      latitude: 0,
      longitude: 0,
      features: [],
      amenities: [],
      ...(category === "Rent" ? { roiPercentage: 0 } : {}),
      ...(category === "Buy" || category === "Rent" || category.includes("Commercial") ? { numberOfCheques: 1 } : {}),
      ...(category === "Off Plan" ? { 
        completionDate: "",
        paymentPlan: "",
        developer: "",
      } : {}),
      ...(category.includes("Commercial") ? { commercialType: "" } : {}),
    },
  });

  const handleSubmit = (values) => {
    // Here you would typically make an API call
    console.log("Form values:", values);
    onSubmit(values);
  };

  const isCommercial = category.includes("Commercial");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-white space-y-4">
          <h3 className="text-lg font-medium">General Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(isCommercial ? commercialTypes : propertyTypes).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="propertyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the property"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="propertyZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ZIP code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="propertyFeaturedImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pricing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price {category === "Rent" ? "(Yearly)" : ""}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(category === "Buy" || category === "Rent" || category.includes("Commercial")) && (
              <FormField
                control={form.control}
                name="numberOfCheques"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Cheques</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Enter number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {category === "Rent" && (
              <FormField
                control={form.control}
                name="roiPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ROI Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter ROI %" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="brokerFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker Fee</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter broker fee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {category === "Off Plan" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="developer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter developer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Plan</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment plan details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Property Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="propertySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (sq ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyRooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of rooms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyBedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of bedrooms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyBathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of bathrooms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyKitchen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kitchens</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of kitchens" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dldPermitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DLD Permit Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter permit number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dldQrCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DLD QR Code URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter QR code URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockAgents.map((agent) => (
                       <SelectItem key={agent.id} value={agent.id}> 
                       {agent.name}
                     </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="Enter latitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="Enter longitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit Property</Button>
        </div>
      </form>
    </Form>
  );
};