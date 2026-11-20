const { metro, patcher } = vendetta;
const TARGET_ID = "1184885354751344690";

let patches = [];

export default {
  onLoad() {
    const PrivateChannelSortStore = metro.findByStoreName("PrivateChannelSortStore");
    const ChannelStore = metro.findByStoreName("ChannelStore");

    // 1. Ukrywa kanał na głównej posortowanej liście DM
    if (PrivateChannelSortStore?.getPrivateChannelIds) {
      patches.push(
        patcher.after("getPrivateChannelIds", PrivateChannelSortStore, (_, res) => {
          return Array.isArray(res) ? res.filter((id) => id !== TARGET_ID) : res;
        })
      );
    }

    // 2. Ukrywa obiekt kanału na liście wszystkich kanałów prywatnych
    if (ChannelStore?.getSortedPrivateChannels) {
      patches.push(
        patcher.after("getSortedPrivateChannels", ChannelStore, (_, res) => {
          return Array.isArray(res) ? res.filter((ch) => ch?.id !== TARGET_ID) : res;
        })
      );
    }
  },

  onUnload() {
    patches.forEach((unpatch) => unpatch());
    patches = [];
  }
};
Używaj kodu z rozwagą.

2. Plik konfiguracyjny (manifest.json)

Revenge wymaga tego pliku, aby rozpoznać wtyczkę. W polu "hash" możesz wpisać dowolny ciąg znaków (np. aktualną datę), gdy robisz prosty plugin bez kompilatora:
json
{
  "name": "Hide Specific DM",
  "description": "Ukrywa wybraną rozmowę prywatną z listy.",
  "authors": [
    {
      "name": "User"
    }
  ],
  "main": "index.js",
  "vendetta": {
    "icon": "ic_eye_slash_24px"
  },
  "hash": "1"
}
