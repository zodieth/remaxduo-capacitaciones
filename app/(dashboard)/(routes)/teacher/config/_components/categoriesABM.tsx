"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmationDialog } from "./deleteConfirmationDialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const api = {
  fetchCategories: async (): Promise<Category[]> => {
    const response = await fetch("/api/category");
    if (!response.ok) {
      toast.error("Error al cargar las categorías");
      throw new Error("Error al cargar las categorías");
    }
    return response.json();
  },
  createCategory: async (categoryName: string): Promise<Category> => {
    const response = await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });
    if (!response.ok) {
      toast.error("Error al crear la categoría");
      throw new Error("Error al crear la categoría");
    }
    return response.json();
  },
  updateCategory: async (id: string, newName: string): Promise<void> => {
    const response = await fetch("/api/category", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName, id: id }),
    });
    if (!response.ok) {
      toast.error("Error al actualizar la categoría");
      throw new Error("Error al actualizar la categoría");
    }
  },
  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch("/api/category", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
      toast.error("Error al eliminar la categoría");
      throw new Error("Error al eliminar la categoría");
    }
  },
};

const formSchema = z.object({
  name: z.string().min(1, "Ingrese un nombre de categoría"),
});

interface FormValues {
  name: string;
}

type Category = {
  id: string;
  name: string;
};

const CategoriesABM = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error(error);
        // Manejo del error en api.fetchCategories...
      }
    };
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (editingIndex === null) {
      const newCategory = await api.createCategory(data.name);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      toast.success("Categoría creada");
    } else {
      const categoryId = categories[editingIndex].id;
      await api.updateCategory(categoryId, data.name);
      const updatedCategories = categories.map((category, index) =>
        index === editingIndex ? { ...category, name: data.name } : category
      );
      setCategories(updatedCategories);
      setEditingIndex(null);
      toast.success("Categoría actualizada");
    }
    reset({ name: "" });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    reset({ name: categories[index].name });
  };

  const handleDelete = async (index: number) => {
    const categoryId = categories[index].id;
    await api.deleteCategory(categoryId);
    setCategories((prevCategories) =>
      prevCategories.filter((_, i) => i !== index)
    );
    toast.success("Categoría eliminada");
  };

  const openConfirmationDialog = (index: number) => {
    setOpenDialog(true);
    setCategoryToDelete(index);
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      await handleDelete(categoryToDelete);
    }
    setOpenDialog(false);
    setCategoryToDelete(null);
  };

  const onCancelEdit = () => {
    setEditingIndex(null);
    reset({ name: "" });
  };

  return (
    <div className="space-y-4 w-1/2 border border-gray-300 rounded-lg p-6">
      <h1 className="font-bold text-xl">Categorías</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Nombre de la categoría</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre de la categoría"
                {...register("name")}
              />
            </FormControl>
            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
          </FormItem>
          <Button type="submit" className="mt-4 mr-3">
            {editingIndex === null ? "Crear Categoría" : "Actualizar Categoría"}
          </Button>
          {editingIndex !== null && (
            <Button onClick={() => onCancelEdit()}>Cancelar</Button>
          )}
        </form>
      </Form>
      {categories.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <ul className="mt-4">
          {categories.map((category, index) => (
            <li
              key={category.id}
              className={`flex justify-between items-center p-1 rounded mt-1 ${
                index === editingIndex ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {category.name}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => startEditing(index)}
                  className="text-sm"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openConfirmationDialog(index)}
                  className="text-sm bg-red-500 hover:bg-red-700 text-white"
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DeleteConfirmationDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default CategoriesABM;
