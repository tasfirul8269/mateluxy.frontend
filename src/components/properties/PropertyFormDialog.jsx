// components/properties/PropertyFormDialog.jsx
import React, { useState } from 'react';
import { Dialog } from "@/components/AdminPannel/ui/dialog";
import PropertyCategorySelector from './PropertyCategorySelector';
import PropertyForm from './PropertyForm';

const PropertyFormDialog = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {!selectedCategory ? (
          <PropertyCategorySelector 
            onSelectCategory={setSelectedCategory} 
            onCancel={onClose}
          />
        ) : (
          <PropertyForm
            category={selectedCategory}
            onCancel={() => {
              setSelectedCategory(null);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};