export interface Permission {
  permiso: string;
  name: string;
}

export interface PermissionGroup {
  name: string;
  permisos: Permission[];
}

export const PERMISOS: PermissionGroup[] = [
  {
    name: "Roles y Permisos",
    permisos: [
      { permiso: "register_role", name: "Registrar Rol" },
      { permiso: "edit_role", name: "Editar Rol" },
      { permiso: "delete_role", name: "Eliminar Rol" },
      { permiso: "list_role", name: "Listar Roles" },
    ],
  },
  {
    name: "Usuarios",
    permisos: [
      { permiso: "register_user", name: "Registrar Usuario" },
      { permiso: "edit_user", name: "Editar Usuario" },
      { permiso: "delete_user", name: "Eliminar Usuario" },
      { permiso: "list_user", name: "Listar Usuarios" },
    ],
  },
  {
    name: "Categorias",
    permisos: [
      { permiso: "register_categorie", name: "Registrar Categoria" },
      { permiso: "edit_categorie", name: "Editar Categoria" },
      { permiso: "delete_categorie", name: "Eliminar Categoria" },
      { permiso: "list_categorie", name: "Listar Categorias" },
    ],
  },
  {
    name: "Productos",
    permisos: [
      { permiso: "register_product", name: "Registrar Producto" },
      { permiso: "edit_product", name: "Editar Producto" },
      { permiso: "delete_product", name: "Eliminar Producto" },
      { permiso: "list_product", name: "Listar Productos" },
    ],
  },
  {
    name: "Clientes",
    permisos: [
      { permiso: "register_client", name: "Registrar Cliente" },
      { permiso: "edit_client", name: "Editar Cliente" },
      { permiso: "delete_client", name: "Eliminar Cliente" },
      { permiso: "list_client", name: "Listar Clientes" },
    ],
  },
  {
    name: "Ventas",
    permisos: [
      { permiso: "register_sale", name: "Registrar Venta" },
      { permiso: "edit_sale", name: "Editar Venta" },
      { permiso: "delete_sale", name: "Eliminar Venta" },
      { permiso: "list_sale", name: "Listar Ventas" },
    ],
  },
];

export interface Role {
  id: number;
  name: string;
  permissions: string[];
  created_at: string;
}

export interface CreatedRole {
  code: number;
  message: string;
  role: Role;
}

export interface ResponseRole {
  roles: Role[];
  total: number;
  pagination: number;
}
