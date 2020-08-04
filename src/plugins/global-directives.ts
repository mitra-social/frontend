import Vue from "vue";

import { Attachment } from "@/model/attachment";

Vue.directive("set-attach-size", function (el, binding) {
  const attachment: Attachment = binding.value.attach;
  const maxSize = binding.value.maxSize;
  const img = new Image();

  img.onload = () => {
    let width = attachment.width || 0;
    let height = attachment.height || 0;

    if (!attachment.width && !attachment.height) {
      width = img.width;
      height = img.height;
    } else if (!attachment.width && attachment.height) {
      width = (img.width / img.height) * attachment.height;
    } else if (attachment.width && !attachment.height) {
      height = (img.height / img.width) * attachment.width;
    }

    if (maxSize && width && height && (maxSize < width || maxSize < height)) {
      if (width > height) {
        width = maxSize;
        height = (height / width) * maxSize;
      } else if (width < height) {
        width = (width / height) * maxSize;
        height = maxSize;
      } else {
        width = maxSize;
        height = maxSize;
      }
    }
    el.style.maxWidth = `${width}px`;
    el.style.maxHeight = `${height}px`;
  };
  img.src = attachment.url;
});
