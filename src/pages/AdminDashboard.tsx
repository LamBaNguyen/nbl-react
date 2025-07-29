import { useEffect, useState, useRef } from "react";
import { getPets, addPet, updatePet, deletePet } from "../services/adminApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import type { FileUploadSelectEvent } from "primereact/fileupload";
import { useDebounce } from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

interface Pet {
  id?: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function AdminDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [visible, setVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [editingPet, setEditingPet] = useState<Pet>({
    name: "",
    price: 0,
    image: "",
    category: "",
  });
  const toast = useRef<Toast>(null);
  const { t } = useTranslation();

  // confirm dialog state
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const categories = [
    { label: `${t("admin.category")} - Dog`, value: "dog" },
    { label: `${t("admin.category")} - Cat`, value: "cat" },
    { label: `${t("admin.category")} - Bird`, value: "bird" },
    { label: `${t("admin.category")} - Other`, value: "other" },
  ];

  const loadPets = () => getPets().then((res) => setPets(res.data));

  useEffect(() => {
    loadPets();
  }, []);

  const handleSave = async () => {
    if (
      !editingPet.name.trim() ||
      editingPet.price <= 0 ||
      !editingPet.image.trim() ||
      !editingPet.category.trim()
    ) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.validation") || "Validation",
        detail: t("common.fillAll") || "Please fill all fields!",
        life: 2000,
      });
      return;
    }

    if (editingPet.id) {
      await updatePet(editingPet.id, editingPet);
      toast.current?.show({
        severity: "success",
        summary: t("common.updated"),
        detail: t("common.updated"),
        life: 2000,
      });
    } else {
      await addPet(editingPet);
      toast.current?.show({
        severity: "success",
        summary: t("common.added"),
        detail: t("common.added"),
        life: 2000,
      });
    }

    loadPets();
    setVisible(false);
    setEditingPet({ name: "", price: 0, image: "", category: "" });
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const handleAcceptDelete = async () => {
    if (deleteId !== null) {
      await deletePet(deleteId);
      toast.current?.show({
        severity: "info",
        summary: t("common.deleted"),
        detail: t("common.deleted"),
        life: 2000,
      });
      loadPets();
    }
    setDeleteId(null);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const filteredPets = pets.filter((p) => {
    const matchCategory =
      filterCategory === "all" || !filterCategory
        ? true
        : p.category === filterCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">{t("admin.title")}</h2>

      {/* Custom Confirm Dialog */}
      <CustomConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        header={t("common.confirmation")}
        message={t("common.confirmDelete")}
        onAccept={handleAcceptDelete}
        acceptLabel={t("checkoutConfirm.yes")}
        rejectLabel={t("checkoutConfirm.no")}
        acceptClassName="p-button-danger"
      />

      {/* Filter + Search + Add Button */}
      <div className="flex gap-3 mb-3">
        <Dropdown
          value={filterCategory}
          options={[
            { label: t("admin.filter") || "All", value: "all" },
            ...categories,
          ]}
          onChange={(e) => setFilterCategory(e.value)}
          placeholder={t("admin.filter")}
          className="w-48"
        />
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("admin.search")}
          className="w-64"
        />
        <Button
          label={t("admin.add")}
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
          className="ml-auto"
        />
      </div>

      {/* DataTable */}
      <DataTable
        value={filteredPets}
        paginator
        rows={5}
        responsiveLayout="scroll"
        emptyMessage={t("common.noResults")}
      >
        <Column field="name" header={t("admin.name")}></Column>
        <Column field="price" header={t("admin.price")}></Column>
        <Column
          field="image"
          header={t("admin.image")}
          body={(row) => (
            <img
              src={row.image}
              alt={row.name}
              className="w-16 h-16 object-cover"
            />
          )}
        />
        <Column field="category" header={t("admin.category")}></Column>
        <Column
          header={t("admin.actions")}
          body={(row) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => {
                  setEditingPet(row);
                  setVisible(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => confirmDelete(row.id!)}
              />
            </>
          )}
        ></Column>
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        header={editingPet.id ? t("admin.edit") : t("admin.add")}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-col gap-3">
          <InputText
            value={editingPet.name}
            onChange={(e) =>
              setEditingPet({ ...editingPet, name: e.target.value })
            }
            placeholder={t("admin.name")}
          />
          <Dropdown
            value={editingPet.category}
            options={categories}
            onChange={(e) =>
              setEditingPet({ ...editingPet, category: e.value })
            }
            placeholder={t("admin.category")}
          />
          <InputText
            type="number"
            value={editingPet.price.toString()}
            onChange={(e) =>
              setEditingPet({ ...editingPet, price: +e.target.value })
            }
            placeholder={t("admin.price")}
          />
          <FileUpload
            mode="basic"
            name="demo[]"
            accept="image/*"
            maxFileSize={1000000}
            chooseLabel={t("admin.image")}
            onSelect={async (e: FileUploadSelectEvent) => {
              const file = e.files[0];
              const base64 = await toBase64(file);
              setEditingPet({ ...editingPet, image: base64 });
            }}
          />
          {editingPet.image && (
            <img
              src={editingPet.image}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}

          <Button label={t("common.save")} onClick={handleSave} />
        </div>
      </Dialog>
    </div>
  );
}
