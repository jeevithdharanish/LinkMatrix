'use client';
import { savePageSettings } from "@/actions/pageActions";
import SubmitButton from "@/components/ui/SubmitButton";
import RadioTogglers from "@/components/formitems/RadioTogglers";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/lib/upload";
import { faCloudArrowUp, faImage, faPalette, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifySaveResult } from "@/lib/notify";

export default function PageSettingsForm({ page, user }) {
  const router = useRouter();
  const [bgType, setBgType] = useState(page.bgType);
  const [bgColor, setBgColor] = useState(page.bgColor);
  const [bgImage, setBgImage] = useState(page.bgImage);
  const [avatar, setAvatar] = useState(user?.image);
  const [showAvailableBadge, setShowAvailableBadge] = useState(page.showAvailableBadge !== false);

  async function saveBaseSettings(formData) {
    notifySaveResult(await savePageSettings(formData), 'Saved!');
  }

  // Saves a single uploaded image field, then refreshes server data in place
  async function saveUploadedImage(field, link, successMessage) {
    const formData = new FormData();
    formData.set(field, link);
    if (notifySaveResult(await savePageSettings(formData), successMessage)) {
      router.refresh();
    }
  }

  async function handleCoverImageChange(ev) {
    await upload(ev, async (link) => {
      setBgImage(link);
      await saveUploadedImage('bgImage', link, 'Background image updated!');
    });
  }

  async function handleAvatarImageChange(ev) {
    await upload(ev, async (link) => {
      setAvatar(link);
      await saveUploadedImage('avatar', link, 'Avatar updated!');
    });
  }

  return (
    <div>
      <SectionBox>
        <form action={saveBaseSettings}>
          <div
            className="py-4 -m-6 mb-0 min-h-[280px] flex justify-center items-center bg-cover bg-center rounded-t-2xl"
            style={
              bgType === 'color'
                ? { backgroundColor: bgColor }
                : { backgroundImage: `url(${bgImage})` }
            }
          >
            <div>
              <RadioTogglers
                defaultValue={page.bgType}
                options={[
                  { value: 'color', icon: faPalette, label: 'Color' },
                  { value: 'image', icon: faImage, label: 'Image' },
                ]}
                onChange={val => setBgType(val)}
              />
              {bgType === 'color' && (
                <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700/80 backdrop-blur-md shadow-md text-gray-700 dark:text-slate-200 p-3 mt-3 rounded-xl">
                  <div className="flex gap-2 justify-center items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Background color:</span>
                    <input
                      type="color"
                      name="bgColor"
                      onChange={ev => setBgColor(ev.target.value)}
                      defaultValue={page.bgColor}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
              )}
              {bgType === 'image' && (
                <div className="flex justify-center">
                  <label className="bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700/80 backdrop-blur-md shadow-md px-4 py-2.5 mt-3 flex gap-2 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <input type="hidden" name="bgImage" value={bgImage} />
                    <input
                      type="file"
                      onChange={handleCoverImageChange}
                      className="hidden" />
                    <div className="flex gap-2 items-center text-gray-700 dark:text-slate-200">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="text-indigo-500" />
                      <span className="text-sm font-medium">Change image</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center -mb-8">
            <div className="relative -top-8 w-[120px] h-[120px]">
              <div className="overflow-hidden h-full rounded-full border-4 border-white dark:border-slate-800 shadow-lg ring-2 ring-gray-100 dark:ring-slate-700">
                <Image
                  className="w-full h-full object-cover"
                  src={avatar}
                  alt={'avatar'}
                  width={128} height={128} />
              </div>
              <label
                htmlFor="avatarIn"
                className="absolute bottom-1 -right-1 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-slate-700 aspect-square flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <FontAwesomeIcon size={'lg'} icon={faCloudArrowUp} className="text-indigo-500" />
              </label>
              <input onChange={handleAvatarImageChange} id="avatarIn" type="file" className="hidden" />
              <input type="hidden" name="avatar" value={avatar} />
            </div>
          </div>
          <div className="p-0 space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="nameIn">Display name</label>
              <input
                type="text"
                id="nameIn"
                name="displayName"
                defaultValue={page.displayName}
                placeholder="John Doe"
                className="w-full border border-gray-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 transition-all bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="locationIn">Location</label>
              <input
                type="text"
                id="locationIn"
                name="location"
                defaultValue={page.location}
                placeholder="Somewhere in the world"
                className="w-full border border-gray-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 transition-all bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5" htmlFor="bioIn">Bio</label>
              <textarea
                name="bio"
                defaultValue={page.bio}
                id="bioIn"
                placeholder="Your bio goes here..."
                rows={3}
                className="w-full border border-gray-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 transition-all resize-none bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between border border-gray-200 dark:border-slate-700/80 rounded-xl p-3.5 bg-white dark:bg-slate-800/80">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-200">&quot;Available for opportunities&quot; badge</p>
                <p className="text-xs text-gray-400 dark:text-slate-400">Shown at the top of your public page</p>
              </div>
              <input type="hidden" name="showAvailableBadge" value={showAvailableBadge ? 'true' : 'false'} />
              <input
                type="checkbox"
                checked={showAvailableBadge}
                onChange={ev => setShowAvailableBadge(ev.target.checked)}
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                aria-label="Show available for opportunities badge"
              />
            </div>
            <div className="max-w-[200px] mx-auto pt-2">
              <SubmitButton>
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
              </SubmitButton>
            </div>
          </div>
        </form>
      </SectionBox>
    </div>
  );
}
