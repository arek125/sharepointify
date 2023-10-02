import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  let userData = ref({
    Title: "",
    LoginName: "",
    dateFormat: "DD.MM.YYYY",
    siteInfo: { Picture: { Url: "" }, Department: "" },
    profilePictureUrl: "",
    userProfiles: {},
    groups: []
  });
  const getUserData = async (url:String) => {
    let response = await axios.get(url + "/_api/web/CurrentUser", {
      headers: { accept: "application/json; odata=verbose" },
    });
    userData.value = response.data.d
    //userData.value.siteInfo = {Picture: {Url: ''}, Department: ''}
    response = await axios.get(
      url +
        "/_api/Web/SiteUserInfoList/Items?$filter=Id eq " +
        response.data.d.Id,
      { headers: { accept: "application/json; odata=verbose" } }
    );
    userData.value.siteInfo = response.data.d.results[0]
    response = await axios.get(url + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties', { 
        headers: { accept: 'application/json; odata=verbose' }
    })
    userData.value.userProfiles = response.data.d
    userData.value.profilePictureUrl = url+"/_layouts/15/userphoto.aspx?size=M&accountname=" + userData.value.LoginName
    response = await axios.get(url + '/_api/web/CurrentUser/Groups', { 
        headers: {accept: 'application/json; odata=verbose'}
    })
    userData.value.groups = response.data.d.results
  };

  return { userData, getUserData };
});
