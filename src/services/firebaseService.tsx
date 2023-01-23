import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import { getAuth} from 'firebase/auth'
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { bindAll } from 'lodash';

import configData from '../../config.json';


const firebaseConfig = configData;


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export const auth = getAuth(app);


export let addUserInfo = async (userdata: any) => {
    try{
        const docRef = await setDoc(doc(db, "Users", userdata.uid), userdata);
        return "";
    } catch (err) {
        console.log("addUserInfo Error: ", err);
    }
}


export let updateUserdata = async (data:{}) => {
    try{
        if(auth.currentUser != null){
            const ref = doc(db, "Users", auth.currentUser.uid);
            await updateDoc(ref, data);
        }else{
            console.log("updateUserdata: auth.currentUser is null")
        }
    }catch(err){
        console.log("updateUserdata Error: ", err);
    }
}


export let getUserInfo = async () => {
    try{
        if (auth.currentUser){
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const docSnap = await getDoc(userRef);
            if(docSnap.exists()){
                return docSnap.data();
            }else{
                console.log("getUserInfo Error: Doc does not exist");
            }
        }else{
            console.log("getUserInfo Error: User not set");
        }
    }catch(err){
        console.log("getUserInfo Error: ", err);
    }
    
}

export let getActiveOffers = async () => {
    const q = query(collection(db, "Marketplace"), where("uid", "==", auth.currentUser?.uid));
    try{
        const querySnapshot = await getDocs(q);
        const result:{}[] = [];
        const dataWithPath: {}[]= [];
        querySnapshot.forEach(async (doc) => {
            let id = doc.id;
            let data = doc.data();
            data.id = id;
            result.push(data);
        })
        await Promise.all(result.map(async (doc) => {
            let imageList = [];
            await Promise.all(doc.images.map(async(img) => {
                let url = await getImageUrl(img);
                imageList.push(url)
            }))
            doc.imagesStore = doc.images;
            doc.images = imageList;
            dataWithPath.push(doc);
        }))
        return dataWithPath;
    }catch(err){
        console.log("getChild Error:", err);
    }
}

export async function deleteEntry(collection:string, id:string){
    try{
        await deleteDoc(doc(db, collection, id));
    }catch(err){
        console.log("deleteEntry Error: ", err)
    }
}

export async function uploadData(uri:any, storagePath:string) {
    // try{
    const reference = ref(storage, storagePath);
    const response = await fetch(uri);
    const blobFile = await response.blob();
    const uploadTask = await uploadBytesResumable(reference, blobFile);
    return uploadTask;
}

export async function deleteImages(storagePaths:string[]){
    try{
        storagePaths.map((path) => {
            const reference = ref(storage, path);
            deleteObject(reference);
        })
    }catch(err){
        console.log("deleteImages Error: ",err);
    }
    
}   

export async function getImageUrl(storagePath:string) {
    try{
        const url = await getDownloadURL(ref(storage, storagePath));
        return url;
    }catch(err){
        console.log("getImageUrl Error: ",err);
        return storagePath;
    }
    
}

export async function getCurrentCategory(current:string){
    const q = query(collection(db, "Categories"), where("current", "==", current));
    const result:{}[] = [];
    try{
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            result.push(doc.data());
        })
        return result;
    }catch(err){
        console.log("getChild Error:", err);
    }
}

export async function getPossibleCategories(selectedCategory:{}[], result:Array<string>){
    await Promise.all(selectedCategory.map(async (category) => {
        if(result.indexOf(category.current) == -1){
            result.push(category.current);
        }
        if (category.child != ""){
            result = await getPossibleCategories(await getCurrentCategory(category.child), result);
        }else{
            return result;
        }
    }))
    return result;
}

export async function getCollection(_collection:string, load_img=true){
    try{
        const newsRef =  collection(db, _collection);
        const querySnapshot = await getDocs(newsRef);
        const result:{}[] = [];
        const dataWithPath: {}[]= [];
        querySnapshot.forEach(async (doc) => {
            let id = doc.id;
            let data = doc.data();
            data.id = id;
            result.push(data);
        })
        if(load_img){
            await Promise.all(result.map(async (doc) => {
                let imageList = [];
                await Promise.all(doc.images.map(async(img) => {
                    let url = await getImageUrl(img);
                    imageList.push(url)
                }))
                doc.images = imageList;
                dataWithPath.push(doc);
            }))
            return dataWithPath;
        }else{
            return result;
        }
    }catch(err){
        console.log("getCollection Error: ", err);
    }
    
}

export async function getOffers(){
    const offers = await getCollection("Marketplace", false);
    return offers;
}

export async function getServices(){
    const offers = await getCollection("Services", false);
    return offers;
}

export async function getFilteredOffers(searchString:string, market=true){
    let offers
    if (market){
        offers = await getOffers();
    }else {
        offers = await getServices();
    }
    
    const results:{}[] = [];
    if (offers != undefined){
        let result
        if(market){
            result = offers.filter(x => String(x.name.toLowerCase()).includes(searchString.toLowerCase()));
        }else{
            if(searchString != ""){
                result = offers.filter(x => String(x.company_name.toLowerCase()).includes(searchString.toLowerCase()));
            }else{
                return; 
            }
        }
        
        await Promise.all(result.map(async (doc) => {
            if(market){
                let category = await getCurrentCategory(doc.item_category);
                results.push({'child': doc.name, 'fullpath': category[0].fullpath});
            }else{
                let category = await getCurrentCategory(doc.item_category[0]);
                results.push({'child': doc.company_name, 'fullpath': category[0].fullpath});
            }
            
        }))
        return results
    }else{
        console.log("getFilterdOffers Error");
    }
}

export async function createOffer(offerData:{}){
    try{
        const ref = doc(collection(db, "Marketplace"));
        await setDoc(ref, offerData);
        return true;
    } catch (err) {
        console.log("createOffer Error: ", err);
        return false;
    }
}

export default app;