# TODO for Adding Cross Buttons to Existing Images and Videos

1. Update the existing images section in ClosedEvents component:
   - Ensure each image is wrapped in a relative div.
   - Add a cross button (×) positioned absolutely on each image.
   - Implement onClick handler: async function that dispatches deleteEventImages(item.id), awaits the result, then dispatches getEventImagesByEMID(selectedEvent.EventMasterID), and shows toast notifications.
   - [x] Completed

2. Update the existing videos section in ClosedEvents component:
   - Wrap each video in a relative div.
   - Add a cross button (×) positioned absolutely on each video.
   - Implement onClick handler: same as above, async function with dispatch, await, refresh, toast.
   - [x] Completed

3. Test the functionality:
   - Upload some media to have existing images/videos.
   - Click the cross button on an image/video.
   - Verify deletion, list refresh, and toast messages.
   - [x] Completed
