'use client';

import { savePageButtons } from "@/actions/pageActions";
import SubmitButton from "@/components/ui/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { ReactSortable } from "react-sortablejs";
import { faGripLines, faPlus, faSave, faTrash, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FormHeader from "@/components/ui/FormHeader";
import { notifySaveResult } from "@/lib/notify";
import { allButtons } from "@/lib/socialButtons";

function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PageButtonsForm({ user, page }) {

  const pageButtons = page.buttons || {};
  // Look up the full button config (icon, label, placeholder) for each saved key;
  // filter(Boolean) drops keys that no longer exist in allButtons
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
    notifySaveResult(await savePageButtons(formData), 'Settings saved!');
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
        <FormHeader title="Social Buttons" description="Add, configure, and reorder social profile links on your page" icon={faShareNodes} />
        <ReactSortable
          handle=".handle"
          list={activeButtons}
          setList={setActiveButtons}>
          {activeButtons.map(b => {
            const buttonValue = b.key in pageButtons ? pageButtons[b.key] : '';

            return (
              <div key={b.key} className="mb-3 md:flex items-center p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200 bg-gray-50/50 dark:bg-slate-850/50">
                <div className="w-48 flex h-full text-gray-700 dark:text-slate-350 p-1 gap-2.5 items-center">
                  <FontAwesomeIcon
                    icon={faGripLines}
                    className="cursor-grab text-gray-300 dark:text-slate-600 handle p-2 hover:text-gray-500 dark:hover:text-slate-400 transition-colors" />
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={b.icon} className="text-indigo-500 dark:text-indigo-400 text-sm" />
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
                    className="border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 w-full text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    onClick={() => removeButton(b)}
                    type="button"
                    aria-label={`Remove ${upperFirst(b.label)} button`}
                    className="py-2 px-3 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 dark:hover:bg-red-900/40 transition-all duration-200 flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </ReactSortable>
        <div className="flex flex-wrap gap-2 mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
          {availableButtons.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => addButtonToProfile(b)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200">
              <FontAwesomeIcon icon={b.icon} className="text-xs" />
              <span>{upperFirst(b.label)}</span>
              <FontAwesomeIcon icon={faPlus} className="text-xs text-gray-400 dark:text-slate-500" />
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
