<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card no-body>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>🔐 Roles y Permisos</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" v-if="authStore.isPermitedRoute('register_role')" variant="success" @click="openModal = !openModal">
                                    <i class="far fa-plus-square ml-3"></i> Registrar
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="5">
                                <b-form-input
                                    type="text"
                                    id="role"
                                    v-model="search"
                                    placeholder="Buscar por role"
                                />
                            </b-col>
                            <b-col lg="3" md="3">
                                <b-button type="button" @click="list" variant="success">
                                    <i class="fas fa-search"></i>
                                </b-button>
                                <b-button type="button" @click="reset" variant="dark" class="mx-2">
                                    <i class="fas fa-sync"></i>
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-card-header>
                    <b-card-body class="pt-0">
                        <div class="table-responsive m-0">
                            <table class="table datatable" id="datatable_1">
                                <thead class="table-light">
                                    <tr>
                                        <th>Id</th>
                                        <th>Role</th>
                                        <th>Permisos</th>
                                        <th>Fecha R.</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(role, index) in roles" :key="index">
                                        <td>{{ role.id }}</td>
                                        <td>{{ role.name }}</td>
                                        <td>
                                            <ul>
                                                <li v-for="(permission, index1) in role.permissions" :key="index1">
                                                    {{ permission }}
                                                </li>
                                            </ul>
                                        </td>
                                        <td>{{ role.created_at }}</td>
                                        <td>
                                            <a href="#" onclick="return false;" v-if="authStore.isPermitedRoute('edit_role')"  @click="editRole(role)">
                                                <i class="las la-pen text-secondary fs-22"></i></a>{{ " " }}
                                            <a href="#" onclick="return false;" v-if="authStore.isPermitedRoute('delete_role')" @click="deleteRole(role)">
                                                <i class="las la-trash-alt text-secondary fs-22"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </b-card-body>
                </b-card>
                <b-pagination v-model="currentPage" :total-rows="totalPage" :per-page="perPageRows" 
                    prev-text="Previous" next-text="Next"
                />
            </b-col>
        </b-row>
        <b-modal
            v-model="openModal"
            :title="`🔐 ${role_selected ? 'Editar' : 'Registrar'} un Rol`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            ok-title="Save changes"
            :ok-variant="themeColor"
            cancel-title="Close"
            centered
            hide-footer
            size="md"
        >
            <b-row>
                <b-col cols="9" class="mb-3">
                    <label
                        for="role"
                        class="col-form-label text-lg-end"
                    >Nombre del Rol</label>
                    <b-form-input
                        type="text"
                        id="role"
                        v-model="name"
                        placeholder="Admin de Sede"
                  />
                </b-col>
                <b-col cols="12">
                    <table class="table table-responsive">
                        <thead class="table-light">
                            <tr>
                                <th>Modulo</th>
                                <th>Permisos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(permission, index) in list_permissions" :key="index">
                                <td>
                                    {{ permission.name }}
                                </td>
                                <td>
                                    <ul>
                                        <!-- ["register_role","register_user","register_categorie"].includes("register_sale") -->
                                        <li style="list-style: none;" class="d-flex" v-for="(permiso, index2) in permission.permisos" :key="index2">
                                            <b-form-checkbox :checked="permissions.includes(permiso.permiso)" @click="addPermission(permiso)"></b-form-checkbox>
                                            <span class="mx-1">{{ permiso.name }}</span> 
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </b-col>
                <b-col lg="12" class="mt-3">
                    <div class="modal-footer">
                        <b-button
                            type="button"
                            variant="secondary"
                            @click="openModal = false"
                        >
                            Cerrar
                        </b-button>
                        <b-button type="button" variant="primary" @click="store">
                           {{ role_selected ? 'Editar' : 'Guardar' }}
                        </b-button>
                    </div>
                </b-col>
            </b-row>
        </b-modal>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import type { AxiosResponse } from "axios";
import { onMounted, ref, watch } from "vue";
import HttpClient from "@/helpers/http-client";
import { PERMISOS, type CreatedRole, type ResponseRole, type Role } from "@/types/roles";

import Swal from "sweetalert2/dist/sweetalert2.js";
import { useAuthStore } from "@/stores/auth";
type TVueSwalInstance = typeof Swal & typeof Swal.fire;

const authStore = useAuthStore();

const roles = ref<Role[]>([]);
const name = ref<String>("");

const openModal = ref(false);
const themeColor = ref<any>("primary");

const list_permissions = ref(PERMISOS);
const permissions = ref<String[]>([]);
const role_selected = ref<Role>();

const currentPage = ref<number>(1);
const totalPage = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string>("");

const list = async () => {
    try {
        const res: AxiosResponse<ResponseRole> = await HttpClient.get(
            "roles?page="+currentPage.value+"&search="+(search.value ?? ''));
        console.log(res);

        roles.value = res.data.roles;
        totalPage.value = res.data.total;
        perPageRows.value = res.data.pagination;
    } catch (error) {
        console.log(error);
    }
}
const reset = () => {
    search.value = "";
    list();
}

const addPermission = async (permiso:any) => {
    let Index = permissions.value.findIndex((permission) => permission == permiso.permiso);
    if(Index != -1){
        permissions.value.splice(Index,1);
    }else{
        permissions.value.push(permiso.permiso);
    }
    console.log(permissions.value);
}

const store = async () => {
    try {
        if(!name.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo nombre es obligatorio",
                "error",
            );
            return;
        }

        if(permissions.value.length == 0){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "Necesitas seleccionar al menos un permiso",
                "error",
            );
            return;
        }
        let res;
        if(role_selected.value){
            const resp: AxiosResponse<CreatedRole> = await HttpClient.put(
            "roles/"+role_selected.value.id,{
               name: name.value,
               permissions: permissions.value,
            });
            res = resp;
        }else{
            const resp: AxiosResponse<CreatedRole> = await HttpClient.post(
                "roles",{
                   name: name.value,
                   permissions: permissions.value,
                });
            res = resp;
        }
        console.log(res);
            if(res.data.code == 405){
                (Swal as TVueSwalInstance).fire(
                    "Upps!",
                    res.data.message,
                    "error",
                );
            }else{
                if(role_selected.value){
                    let Index = roles.value.findIndex((rol) => rol.id == role_selected.value?.id);
                    if(Index != -1){
                        roles.value[Index] = res.data.role;
                    }
                }else{
                    roles.value.unshift(res.data.role);
                }

                openModal.value = false;
                name.value = "";
                permissions.value = [];
                (Swal as TVueSwalInstance).fire(
                    "Genial!",
                    res.data.message,
                    "success",
                );
            }
    } catch (error) {
        console.log(error);
    }
}

const deleteRole = async(role:Role) => {
    (Swal as TVueSwalInstance)
        .fire({
            title: "Confirmar la eliminación",
            text: "¿Estas seguro de eliminar este rol ''"+ role.name + "'' ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminalo!",
        })
        .then(async (result: any) => {
            if (result.isConfirmed) {
                try {
                    
                    const res: AxiosResponse<any> = await HttpClient.delete(
                        "roles/"+role.id);
                    console.log(res);
                    (Swal as TVueSwalInstance).fire(
                        "Genial!",
                        res.data.message,
                        "success",
                    );

                    let Index = roles.value.findIndex((rol) => rol.id == role.id);
                    if(Index != -1){
                        roles.value.splice(Index,1);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
    });
}

const editRole = (role:Role) => {
    openModal.value = true;
    name.value = role.name;
    permissions.value = role.permissions;
    role_selected.value = role;
}

watch(openModal,(value) => {
    if(value == false){
        role_selected.value = undefined;
        name.value = '';
        permissions.value = [];
    }
})

watch(currentPage,(value) => {
    list()
})

onMounted(() => {
    list();
})
</script>