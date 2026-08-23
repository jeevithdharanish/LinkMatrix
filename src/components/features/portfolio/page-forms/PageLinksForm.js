'use client';
import { savePageLinks } from "@/actions/pageActions";
import SubmitButton from "@/components/ui/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/lib/upload";
import { faCloudArrowUp, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormHeader from "@/components/ui/FormHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { notifySaveResult } from "@/lib/notify";
import { ReactSortable } from "react-sortablejs";

export default function PageLinksForm({ page, user }) {
  const [links, setLinks] = useState(page.links || []);

  async function save() {
    notifySaveResult(await savePageLinks(links), 'Saved!');
  }

  function addNewLink() {
    setLinks(prev => [{
      key: Date.now().toString(),
      title: '',
      subtitle: '',
      icon: '',
      url: '',
    }, ...prev]);
  }

  function handleUpload(ev, linkKeyForUpload) {
    upload(ev, uploadedImageUrl => {
      setLinks(prevLinks => {
        const newLinks = [...prevLinks];
        newLinks.forEach((link) => {
          if (link.key === linkKeyForUpload) {
            link.icon = uploadedImageUrl;
          }
        });
        return newLinks;
      });
    });
  }

  function handleLinkChange(keyOfLinkToChange, prop, ev) {
    setLinks(prev => {
      const newLinks = [...prev];
      newLinks.forEach((link) => {
        if (link.key === keyOfLinkToChange) {
          link[prop] = ev.target.value;
        }
      });
      return newLinks;
    });
  }

  function removeLink(linkKeyToRemove) {
    setLinks(prevLinks =>
      [...prevLinks].filter(l => l.key !== linkKeyToRemove)
    );
  }

  return (
    <SectionBox>
      <form action={save}>
        <FormHeader title="Links" description="Add external links to your websites, portfolios, or articles" icon={faLink} />
        <button
          onClick={addNewLink}
          type="button"
          className="btn-dashed-add mb-4">
          <FontAwesomeIcon icon={faPlus} />
          <span>Add new link</span>
        </button>
        <div>
          <ReactSortable
            handle={'.handle'}
            list={links} setList={setLinks}>
            {links.map(l => (
              <div key={l.key} className="mt-3 md:flex gap-5 items-center p-4 border border-gray-200 dark:border-slate-700/80 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200 bg-gray-50/50 dark:bg-slate-800/40">
                <div className="handle cursor-grab">
                  <FontAwesomeIcon
                    className="text-gray-300 dark:text-slate-600 mr-2 hover:text-gray-500 dark:hover:text-slate-400 transition-colors"
                    icon={faGripLines} />
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-slate-800 relative aspect-square overflow-hidden w-14 h-14 flex justify-center items-center rounded-xl border border-gray-200 dark:border-slate-700">
                    {l.icon && (
                      <Image
                        className="w-full h-full object-cover"
                        src={l.icon}
                        alt={'icon'}
                        width={64} height={64} />
                    )}
                    {!l.icon && (
                      <FontAwesomeIcon size="lg" icon={faLink} className="text-gray-400 dark:text-slate-500" />
                    )}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <input
                      onChange={ev => handleUpload(ev, l.key)}
                      id={'icon' + l.key}
                      type="file"
                      className="hidden" />
                    <label htmlFor={'icon' + l.key} className="border border-gray-200 dark:border-slate-700 p-1.5 flex items-center gap-1 text-gray-500 dark:text-slate-300 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition duration-150 text-xs justify-center">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="text-indigo-500" />
                      <span>Icon</span>
                    </label>
                    <button
                      onClick={() => removeLink(l.key)}
                      type="button" className="w-full bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 py-1.5 px-2 flex gap-1 items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition duration-200 text-xs">
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="grow space-y-2 mt-3 md:mt-0">
                  <div>
                    <label htmlFor={`title-${l.key}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Title</label>
                    <input
                      id={`title-${l.key}`}
                      value={l.title}
                      onChange={ev => handleLinkChange(l.key, 'title', ev)}
                      type="text" placeholder="Title" className="border border-gray-200 dark:border-slate-700/80 rounded-xl p-2.5 w-full text-sm bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                  <div>
                    <label htmlFor={`subtitle-${l.key}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Subtitle</label>
                    <input
                      id={`subtitle-${l.key}`}
                      value={l.subtitle}
                      onChange={ev => handleLinkChange(l.key, 'subtitle', ev)}
                      type="text" placeholder="Subtitle (optional)" className="border border-gray-200 dark:border-slate-700/80 rounded-xl p-2.5 w-full text-sm bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                  <div>
                    <label htmlFor={`url-${l.key}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">URL</label>
                    <input
                      id={`url-${l.key}`}
                      value={l.url}
                      onChange={ev => handleLinkChange(l.key, 'url', ev)}
                      type="text" placeholder="https://..." className="border border-gray-200 dark:border-slate-700/80 rounded-xl p-2.5 w-full text-sm bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        <div className="border-t border-gray-100 dark:border-slate-800 pt-4 mt-4">
          <SubmitButton className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}