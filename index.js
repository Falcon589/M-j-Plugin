const { metro, patcher } = vendetta;
const TARGET_ID = "1184885354751344690";

let patches = [];

return {
  onLoad: function () {
    const PrivateChannelSortStore = metro.findByStoreName("PrivateChannelSortStore");
    const ChannelStore = metro.findByStoreName("ChannelStore");

    if (PrivateChannelSortStore && PrivateChannelSortStore.getPrivateChannelIds) {
      patches.push(
        patcher.after("getPrivateChannelIds", PrivateChannelSortStore, function (_, res) {
          return Array.isArray(res) ? res.filter(function (id) { return id !== TARGET_ID; }) : res;
        })
      );
    }

    if (ChannelStore && ChannelStore.getSortedPrivateChannels) {
      patches.push(
        patcher.after("getSortedPrivateChannels", ChannelStore, function (_, res) {
          return Array.isArray(res) ? res.filter(function (ch) { return ch && ch.id !== TARGET_ID; }) : res;
        })
      );
    }
  },

  onUnload: function () {
    patches.forEach(function (unpatch) { unpatch(); });
    patches = [];
  }
};
