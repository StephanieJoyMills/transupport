import axios from "axios";

function getNum(name) { 
  axios.get(`http://0.0.0.0:8080/api/accounts/count`)
      .then(res => {
        const counts = res.data;
        console.log(counts);
        return counts[name];
      })
}

export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      title: true,
      name: 'Accounts',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Active',
      url: '/accounts/non_resolved',
      icon: 'icon-info',
      badge: {
        variant: 'success',
        text: getNum('non_resolved'),
      },
    },
    {
      name: 'At-Risk',
      url: '/accounts/at_risk',
      icon: 'icon-clock',
      badge: {
        variant: 'warning',
        text: getNum('at_risk'),
      },
    },
    {
      name: 'Late',
      url: '/accounts/late',
      icon: 'icon-clock',
      badge: {
        variant: 'danger',
        text: getNum('late'),
      },
    },
    {
      name: 'Cancelled',
      url: '/accounts/cancelled',
      icon: 'icon-close',
      badge: {
        variant: 'danger',
        text: getNum('cancelled'),
      },
    },
    {
      name: 'Resolved',
      url: '/accounts/resolved',
      icon: 'icon-check',
      badge: {
        variant: 'secondary',
        text: getNum('resolved'),
      },
    },
    // {
    //   name: 'Download CoreUI',
    //   url: 'https://coreui.io/react/',
    //   icon: 'icon-cloud-download',
    //   class: 'mt-auto',
    //   variant: 'success',
    //   attributes: { target: '_blank', rel: "noopener" },
    // },
    // {
    //   name: 'Try CoreUI PRO',
    //   url: 'https://coreui.io/pro/react/',
    //   icon: 'icon-layers',
    //   variant: 'danger',
    //   attributes: { target: '_blank', rel: "noopener" },
    // },
  ],
};
