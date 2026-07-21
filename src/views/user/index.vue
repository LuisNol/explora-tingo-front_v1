<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card no-body>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>💁 Usuarios</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" variant="success" @click="openModal = !openModal">
                                    <i class="far fa-plus-square ml-3"></i> Registrar
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="5">
                                <b-form-input
                                    type="text"
                                    v-model="search"
                                    placeholder="Buscar por usuario"
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
                                        <th>ID</th>
                                        <th>NOMBRE Y APELLIDO</th>
                                        <th>EMAIL</th>
                                        <th>PHONE</th>
                                        <th>TIPO DOCUMENTO</th>
                                        <th>N DE DOCUMENTO</th>
                                        <th>ROLE</th>
                                        <th>F.REGISTRO</th>
                                        <TH>ACCIÓN</TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in users" :key="index">
                                        <td>{{user.id}}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <span class="thumb-md justify-content-center d-flex align-items-center bg-purple-subtle text-purple rounded-circle me-2">{{ avatarText(user.full_name) }}</span>
                                                <span>{{ user.full_name }}</span>
                                            </div>
                                        </td>
                                        <td>{{ user.email }}</td>
                                        <td>{{ user.phone }}</td>
                                        <td>{{ user.type_document }}</td>
                                        <td>{{ user.n_document }}</td>
                                        <td>{{ user.role.name }}</td>
                                        <td>{{ user.created_at }}</td>
                                        <td>
                                            <a href="#" onclick="return false;" @click="editUser(user)">
                                                <i class="las la-pen text-secondary fs-22"></i></a>{{ " " }}
                                            <a href="#" onclick="return false;" @click="deleteUser(user)">
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
            :title="`🔐 ${user_selected ? 'Editar' : 'Registrar'} un Usuario`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            ok-title="Save changes"
            :ok-variant="themeColor"
            cancel-title="Close"
            centered
            hide-footer
            size="lg"
        >
            <b-row>
                <b-col lg="5">
                    <label for="name-user" class="col-form-label text-lg-end">Nombre: </label>
                    <b-form-input
                        type="text"
                        id="name-user"
                        v-model="name"
                        placeholder="Example: Jose"
                    />
                </b-col>
                <b-col lg="5">
                    <label for="surname-user" class="col-form-label text-lg-end">Apellido: </label>
                    <b-form-input
                        type="text"
                        id="surname-user"
                        v-model="surname"
                        placeholder="Example: Jose"
                    />
                </b-col>

                <b-col lg="4">
                    <label for="email-user" class="col-form-label text-lg-end">Email: </label>
                    <b-form-input
                        type="text"
                        id="email-user"
                        v-model="email"
                        placeholder="Example: laravest@gmail.com"
                    />
                </b-col>

                <b-col lg="4">
                    <label for="phone-user" class="col-form-label text-lg-end">Telefono: </label>
                    <b-form-input
                        type="number"
                        id="phone-user"
                        v-model="phone"
                        placeholder="Example: laravest@gmail.com"
                    />
                </b-col>
                <b-col lg="4">
                    <label for="role_user" class="col-form-label text-lg-end">Role: </label>
                    <b-form-select id="type_document_list" v-model="role_id">
                        <template v-for="(role, index) in roles" :key="index">
                            <option :value="role.id">{{ role.name }}</option>
                        </template>
                    </b-form-select>
                </b-col>

                <b-col lg="4">
                    <label for="type-document-user" class="col-form-label text-lg-end">Tipo de documento: </label>
                    <b-form-select id="type_document_list" v-model="type_document">
                        <option value="DNI">DNI</option>
                        <option value="PASAPORTE">PASAPORTE</option>
                        <option value="CARNET DE EXTRANJERIA">CARNET DE EXTRANJERIA</option>
                        <option value="TARJETA MILITAR">TARJETA MILITAR</option>
                    </b-form-select>
                </b-col>

                <b-col lg="4">
                    <label for="n_document-user" class="col-form-label text-lg-end">N° de Documento: </label>
                    <b-form-input
                        type="number"
                        id="n_document-user"
                        v-model="n_document"
                        placeholder="Example: #######"
                    />
                </b-col>

                <b-col lg="4">
                    <label for="gender-user" class="col-form-label text-lg-end">Genero: </label>
                    <b-form-radio name="gender-user" @click="gender = 'M'" value="M" :checked="gender == 'M'">Masculino</b-form-radio>
                    {{ " " }}
                    <b-form-radio name="gender-user" @click="gender = 'F'" value="F" :checked="gender == 'F'">Femenino</b-form-radio>
                </b-col>

                <b-col lg="3">
                    <label for="state-user" class="col-form-label text-lg-end">Estado: </label>
                    <b-form-radio name="state-user" @click="state = 1" value="1" :checked="state == 1">Activo</b-form-radio>
                    {{ " " }}
                    <b-form-radio name="state-user" @click="state = 2" value="2" :checked="state == 2">Inactivo</b-form-radio>
                </b-col>

                <b-col lg="4">
                    <label for="password-user" class="col-form-label text-lg-end">Contraseña: </label>
                    <b-form-input
                        type="password"
                        id="password-user"
                        v-model="password"
                        placeholder="*********"
                    />
                </b-col>

                <b-col lg="5">
                    <label for="avatar-user" class="col-form-label text-lg-end">Avatar de Usuario: </label>
                    <b-input-group class="mb-3">
                        <b-form-file @change="loadFile($event)"  />
                        <b-input-group-text>Upload</b-input-group-text>
                    </b-input-group>

                    <img v-if="IMAGEN_PREVIZUALIZA" :src="IMAGEN_PREVIZUALIZA" alt="" width="100px" class="rounded d-block mx-auto" />
                </b-col>

                <b-col lg="12" class="mt-3">
                    <div class="modal-footer">
                        <b-button
                            type="button"
                            variant="secondary"
                            data-bs-dismiss="modal"
                        >
                            Cerrar
                        </b-button>
                        <b-button type="button" variant="primary" @click="store">
                            {{ user_selected ? 'Editar' : 'Crear' }}
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

import Swal from "sweetalert2/dist/sweetalert2.js";
import type { RoleUser, User, UserResponse, Users } from "@/types/users";
type TVueSwalInstance = typeof Swal & typeof Swal.fire;

const users = ref<User[]>([]);
const name = ref<string>("");
const surname = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const type_document = ref<string>("DNI");
const n_document = ref<number>();
const phone = ref<number>();
const gender = ref<string>("M");
const role_id = ref<string>("1");
const state = ref<number>(1);

const roles = ref<RoleUser[]>([]);

const IMAGEN_PREVIZUALIZA = ref<any>(null);
const FILE_AVATAR = ref<File | null>(null);

const openModal = ref(false);
const themeColor = ref<any>("primary");

const user_selected = ref<User>();

const currentPage = ref<number>(1);
const totalPage = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string>("");

const list = async () => {
    try {
        const res: AxiosResponse<Users> = await HttpClient.get(
            "users?page="+currentPage.value+"&search="+(search.value ?? ''));
        console.log(res);

        users.value = res.data.users.data;
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
        if(!surname.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo apellido es obligatorio",
                "error",
            );
            return;
        }
        if(!email.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo email es obligatorio",
                "error",
            );
            return;
        }
        if(!phone.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo telefono es obligatorio",
                "error",
            );
            return;
        }
        if(!n_document.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo numero de documento es obligatorio",
                "error",
            );
            return;
        }
        if(!user_selected.value && !password.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo contraseña es obligatorio",
                "error",
            );
            return;
        }
        if(!role_id.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo role es obligatorio",
                "error",
            );
            return;
        }
        if(!user_selected.value && !FILE_AVATAR.value){
            (Swal as TVueSwalInstance).fire(
                "Upps!",
                "El campo avatar es obligatorio",
                "error",
            );
            return;
        }
        let formData = new FormData();
        formData.append("name",name.value);
        formData.append("surname",surname.value);
        formData.append("email",email.value);
        formData.append("phone",phone.value+"");
        formData.append("role_id",role_id.value+"");
        formData.append("type_document",type_document.value);
        formData.append("n_document",n_document.value+"");
        if(password.value){
            formData.append("password",password.value);
        }
        formData.append("gender",gender.value);
        formData.append("state",state.value+"");
        if(FILE_AVATAR.value){
            formData.append("imagen",FILE_AVATAR.value);
        }

        let res;
        if(user_selected.value){
            const resp: AxiosResponse<UserResponse> = await HttpClient.post(
            "users/"+user_selected.value.id,formData);
            res = resp;
        }else{
            const resp: AxiosResponse<UserResponse> = await HttpClient.post(
                "users",formData);
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
                if(user_selected.value && res.data.user){
                    let Index = users.value.findIndex((usr) => usr.id == user_selected.value?.id);
                    if(Index != -1){
                        users.value[Index] = res.data.user;
                    }
                }else if(res.data.user){
                    users.value.unshift(res.data.user);
                    clearField();
                }

                openModal.value = false;
                name.value = "";
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

const loadFile = ($event:any) => {
    if($event.target.files[0].type.indexOf("image") < 0){
        IMAGEN_PREVIZUALIZA.value = null;
        FILE_AVATAR.value = null;
        (Swal as TVueSwalInstance).fire(
            "Upps!",
            "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN",
            "error",
        );
        // "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN";
        return;
    }
    FILE_AVATAR.value = $event.target.files[0];
    let reader = new FileReader();
    if(FILE_AVATAR.value){
        reader.readAsDataURL(FILE_AVATAR.value);
        reader.onloadend = () => IMAGEN_PREVIZUALIZA.value = reader.result;
    }
}

const deleteUser = async(user:User) => {
    (Swal as TVueSwalInstance)
        .fire({
            title: "Confirmar la eliminación",
            text: "¿Estas seguro de eliminar este usuario ''"+ user.name + "'' ?",
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
                        "users/"+user.id);
                    console.log(res);
                    (Swal as TVueSwalInstance).fire(
                        "Genial!",
                        res.data.message,
                        "success",
                    );

                    let Index = users.value.findIndex((usr) => usr.id == user.id);
                    if(Index != -1){
                        users.value.splice(Index,1);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
    });
}

const editUser = (user:User) => {
    openModal.value = true;
    name.value = user.name;
    surname.value = user.surname ?? '';
    email.value = user.email;
    phone.value = user.phone;
    state.value = user.state;
    IMAGEN_PREVIZUALIZA.value = user.avatar;
    FILE_AVATAR.value = null;
    type_document.value = user.type_document ?? '';
    n_document.value = user.n_document;
    gender.value = user.gender;
    state.value = user.state;
    role_id.value = user.role_id;
    user_selected.value = user;
}

const avatarText = (value:string) => {
    if (!value)
        return ''
    const nameArray = value.split(' ')
    
    return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
}

const clearField = () => {
    name.value = '';
    surname.value = '';
    email.value = '';
    phone.value = 0;
    state.value = 1;
    IMAGEN_PREVIZUALIZA.value = '';
    FILE_AVATAR.value = null;
    type_document.value = '';
    n_document.value = 0;
    gender.value = '';
    state.value = 1;
    password.value = '';
    role_id.value = '';
}

watch(openModal,(value) => {
    if(value == false){
        user_selected.value = undefined;
        clearField();
    }
})

onMounted(() => {
    list();
})
</script>