import { GET_SECTIONS, GET_SECTIONS_FAILURE, GET_CATEGORIES } from "../types";

export function getSectionsAction(firebase) {
    return async (dispatch) => {
        try {
            const response = firebase.db.collection("secciones");
            let secciones = await response.get();
            let sections = [];
            let i = 0;
            for (const sec of secciones.docs) {
                sections.push(sec.data());
                sections[i].id = sec.id;
                i++;
            }
            dispatch(getSections(sections));
        } catch (error) {
            console.log(error);
            dispatch(getSectionsFailure());
        }
    }
}

export function getCategoriesAction(firebase, section) {
    return async (dispatch) => {
        try {
            let response = "";
            if (section) {
                response = firebase.db.collection("categorias").where("seccion", "==", section.codigo_seccion);
            } else {
                response = firebase.db.collection("categorias");
            }
            let categorias = await response.get();
            let categories = [];
            let i = 0;
            for (const cat of categorias.docs) {
                categories.push(cat.data());
                categories[i].id = cat.id;
                i++;
            }
            dispatch(getCategories(categories));
        } catch (error) {
            console.log(error);
        }
    }
}

const getCategories = (categories) => ({
    type: GET_CATEGORIES,
    payload: categories
});

const getSections = (sections) => ({
    type: GET_SECTIONS,
    payload: sections
});

const getSectionsFailure = () => ({
    type: GET_SECTIONS_FAILURE,
    payload: true
});