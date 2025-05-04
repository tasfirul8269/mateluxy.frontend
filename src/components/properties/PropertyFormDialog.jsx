import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/AdminPannel/ui/dialog";
import PropertyCategorySelector from "./PropertyCategorySelector";
import PropertyForm from "./PropertyForm";

const PropertyFormDialog = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleClose = () => {
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-6">
        {!selectedCategory ? (
          <PropertyCategorySelector
            onSelectCategory={(category) => {
              setSelectedCategory(category);
            }}
            onCancel={handleClose}
          />
        ) : (
          <PropertyForm
            category={selectedCategory}
            onSubmit={() => {
              // Refresh properties after successful submission
              handleClose();
            }}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;