'use client';

import { savePageButtons } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { ReactSortable } from "react-sortablejs";
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faWhatsapp,
  faYoutube,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGripLines, faMobile, faPlus, faSave, faTrash, faFileAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";

export const allButtons = [
  { key: 'email', label: 'e-mail', icon: faEnvelope, placeholder: 'test@example.com' },
  { key: 'mobile', label: 'mobile', icon: faMobile, placeholder: '+919878976543' },
  { key: 'instagram', label: 'instagram', icon: faInstagram, placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'facebook', icon: faFacebook, placeholder: 'https://facebook.com/profile' },
  { key: 'linkedin', label: 'linkedin', icon: faLinkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'youtube', label: 'youtube', icon: faYoutube, placeholder: 'https://youtube.com/@channel' },
  { key: 'github', label: 'github', icon: faGithub, placeholder: 'https://github.com/username' },
  { key: 'geeksforgeeks', label: 'geeksforgeeks', icon: faCode, placeholder: 'https://auth.geeksforgeeks.org/user/username' },
  { key: 'resume', label: 'resume', icon: faFileAlt, placeholder: 'https://drive.google.com/file/d/your-resume-link' },
];

function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PageButtonsForm({ user, page }) {
  
  // Safely handle undefined or null `page.buttons`
  const pageButtons = page.buttons || {};
  const pageSavedButtonsKeys = Object.keys(pageButtons);
  const pageSavedButtonsInfo = pageSavedButtonsKeys
    .map(k => allButtons.find(b => b.key === k))
    .filter(Boolean); // Filter out any undefined results

  const [activeButtons, setActiveButtons] = useState(pageSavedButtonsInfo);

  function addButtonToProfile(button) {
    setActiveButtons(prevButtons => {
      return [...prevButtons, button];
    });
  }

  async function saveButtons(formData) {
    await savePageButtons(formData);
    toast.success('Settings saved!');
  }

  function removeButton({ key: keyToRemove }) {
    setActiveButtons(prevButtons => {
      return prevButtons.filter(button => button.key !== keyToRemove);
    });
  }

  const availableButtons = allButtons.filter(b1 => !activeButtons.find(b2 => b1.key === b2.key));

  return (
    <SectionBox>
      <form action={saveButtons}>
        <h2 className="text-2xl font-bold mb-4 text-center">Buttons</h2>
        <ReactSortable
          handle=".handle"
          list={activeButtons}
          setList={setActiveButtons}>
          {activeButtons.map(b => {
            const buttonValue = b.key in pageButtons ? pageButtons[b.key] : ''; // Safely access the value

            return (
              <div key={b.key} className="mb-4 md:flex items-center p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg transition duration-200">
                <div className="w-56 flex h-full text-gray-700 p-2 gap-2 items-center">
                  <FontAwesomeIcon
                    icon={faGripLines}
                    className="cursor-pointer text-gray-400 handle p-2" />
                  <FontAwesomeIcon icon={b.icon} className="text-xl" />
                  <span>{upperFirst(b.label)}:</span>
                </div>
                <div className="grow flex">
                  <input
                    key={b.key}
                    placeholder={b.placeholder}
                    name={b.key}
                    defaultValue={buttonValue} // Use the new buttonValue variable
                    type="text"
                    className="border rounded-md p-2 w-full" 
                  />
                  <button
                    onClick={() => removeButton(b)}
                    type="button"
                    className="py-2 px-4 bg-red-500 text-white rounded-md ml-2 hover:bg-red-600 transition duration-200">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })}
        </ReactSortable>
        <div className="flex flex-wrap gap-2 mt-4 border-y py-4">
          {availableButtons.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => addButtonToProfile(b)}
              className="flex items-center gap-1 p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <FontAwesomeIcon icon={b.icon} />
              <span>{upperFirst(b.label)}</span>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto mt-8">
          <SubmitButton className="bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}
