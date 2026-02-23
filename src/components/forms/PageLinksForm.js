'use client';
import { savePageLinks } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/libs/upload";
import { faCloudArrowUp, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageLinksForm({ page, user }) {
  const [links, setLinks] = useState(page.links || []);

  async function save() {
    await savePageLinks(links);
    toast.success('Saved!');
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
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Links</h2>
        <button
          onClick={addNewLink}
          type="button"
          className="text-indigo-600 text-sm flex gap-2 items-center cursor-pointer mb-4 hover:text-indigo-700 transition duration-200 font-medium">
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
          </div>
          <span>Add new</span>
        </button>
        <div>
          <ReactSortable
            handle={'.handle'}
            list={links} setList={setLinks}>
            {links.map(l => (
              <div key={l.key} className="mt-3 md:flex gap-5 items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-all duration-200 bg-gray-50/50">
                <div className="handle cursor-grab">
                  <FontAwesomeIcon
                    className="text-gray-300 mr-2 hover:text-gray-500 transition-colors"
                    icon={faGripLines} />
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 relative aspect-square overflow-hidden w-14 h-14 flex justify-center items-center rounded-xl border border-gray-200">
                    {l.icon && (
                      <Image
                        className="w-full h-full object-cover"
                        src={l.icon}
                        alt={'icon'}
                        width={64} height={64} />
                    )}
                    {!l.icon && (
                      <FontAwesomeIcon size="lg" icon={faLink} className="text-gray-400" />
                    )}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <input
                      onChange={ev => handleUpload(ev, l.key)}
                      id={'icon' + l.key}
                      type="file"
                      className="hidden" />
                    <label htmlFor={'icon' + l.key} className="border border-gray-200 p-1.5 flex items-center gap-1 text-gray-500 cursor-pointer rounded-lg hover:bg-gray-100 hover:border-gray-300 transition duration-150 text-xs justify-center">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="text-indigo-500" />
                      <span>Icon</span>
                    </label>
                    <button
                      onClick={() => removeLink(l.key)}
                      type="button" className="w-full bg-red-50 text-red-500 py-1.5 px-2 flex gap-1 items-center justify-center rounded-lg hover:bg-red-100 transition duration-200 text-xs">
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="grow space-y-2 mt-3 md:mt-0">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Title</label>
                    <input
                      value={l.title}
                      onChange={ev => handleLinkChange(l.key, 'title', ev)}
                      type="text" placeholder="Title" className="border border-gray-200 rounded-xl p-2.5 w-full text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Subtitle</label>
                    <input
                      value={l.subtitle}
                      onChange={ev => handleLinkChange(l.key, 'subtitle', ev)}
                      type="text" placeholder="Subtitle (optional)" className="border border-gray-200 rounded-xl p-2.5 w-full text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">URL</label>
                    <input
                      value={l.url}
                      onChange={ev => handleLinkChange(l.key, 'url', ev)}
                      type="text" placeholder="https://..." className="border border-gray-200 rounded-xl p-2.5 w-full text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        <div className="border-t border-gray-100 pt-4 mt-4">
          <SubmitButton className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}