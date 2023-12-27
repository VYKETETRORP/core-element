import { Meteor } from "meteor/meteor";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

export default () => {
  const { router } = useRouter();
  const loading = ref(false);
  const error = ref(null);
  const form = reactive({
    username: "",
    password: "",
  });

  const login = () => {
    loading.value = true;
    Meteor.loginWithPassword(form.username, form.password, (err) => {
      if (err) {
        closeLoading();
        error.value = err.reason;
      } else {
        closeLoading();
        error.value = null;
        router.push("/app");
      }
    });
  };

  const logout = () => {
    Meteor.logout((err) => {
      console.log("Logout!");
      if (err) {
        error.value = err.reason;
      } else {
        error.value = null;
        //router.push("/login");
      }
    });
  };

  const closeLoading = () => {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  };

  return { form, loading, login, logout, error };
};
