'use client';

import { savePageButtons } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { ReactSortable } from "react-sortablejs";
import {
  faFacebook,
  faGithub,
  faInstagram,
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

  const pageButtons = page.buttons || {};
  const pageSavedButtonsKeys = Object.keys(pageButtons);
  const pageSavedButtonsInfo = pageSavedButtonsKeys
    .map(k => allButtons.find(b => b.key === k))
    .filter(Boolean);

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
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Social Buttons</h2>
        <ReactSortable
          handle=".handle"
          list={activeButtons}
          setList={setActiveButtons}>
          {activeButtons.map(b => {
            const buttonValue = b.key in pageButtons ? pageButtons[b.key] : '';

            return (
              <div key={b.key} className="mb-3 md:flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-all duration-200 bg-gray-50/50">
                <div className="w-48 flex h-full text-gray-700 p-1 gap-2.5 items-center">
                  <FontAwesomeIcon
                    icon={faGripLines}
                    className="cursor-grab text-gray-300 handle p-2 hover:text-gray-500 transition-colors" />
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={b.icon} className="text-indigo-500 text-sm" />
                  </div>
                  <span className="font-medium text-sm">{upperFirst(b.label)}</span>
                </div>
                <div className="grow flex gap-2 mt-2 md:mt-0">
                  <input
                    key={b.key}
                    placeholder={b.placeholder}
                    name={b.key}
                    defaultValue={buttonValue}
                    type="text"
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    onClick={() => removeButton(b)}
                    type="button"
                    className="py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all duration-200 flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </ReactSortable>
        <div className="flex flex-wrap gap-2 mt-4 border-t border-gray-100 pt-4">
          {availableButtons.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => addButtonToProfile(b)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200">
              <FontAwesomeIcon icon={b.icon} className="text-xs" />
              <span>{upperFirst(b.label)}</span>
              <FontAwesomeIcon icon={faPlus} className="text-xs text-gray-400" />
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto mt-6">
          <SubmitButton>
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}
