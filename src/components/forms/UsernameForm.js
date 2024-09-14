

// 'use client'; import grabUsername from '@/actions/grabUsername';
// import RightIcon from '@/components/icons/RightIcon';
// import {redirect, useRouter} from "next/navigation";
// import {useState} from "react";
// import SubmitButton from "@/components/buttons/SubmitButton";

// export default function UsernameForm({ desiredUsername }) {
//     const router  = useRouter();
//      const [taken, setTaken] = useState(false);
    
//     async function handleSubmit(formData){

//         const result =await grabUsername(formData);

//         console.log(result);
//         setTaken(result === false);
//         if (result) {
//                 router.push('/account?created='+formData.get('username'));
//         }
//     }
   

//     return (
//         <form action={handleSubmit}>
//             <h1 className="text-4xl font-bold text-center mb-2">
//                 Grab Your Username
//             </h1>
//             <p className="text-center mb-6 text-gray-500">
//                 Choose Your Username
//             </p>
//             <div className="max-w-xs mx-auto">
//                 <input
//                     name="username"
//                     defaultValue={desiredUsername}
//                     className="mb-2 text-center block p-2 mx-auto border w-full"
//                     type="text"
//                     placeholder="Username"
//                 />
//                 {taken && (
//                     <div className="border border-red-500 p-2 mb-2 text-center bg-red-400">
//                         Username Is Taken
//                     </div>
//                 )}
//                 <SubmitButton>
//                     <span>Claim Your Username</span>
//                     <RightIcon classname="h-6"/>
//                 </SubmitButton>

//             </div>
//         </form>
//     );
// }
'use client';
import grabUsername from "@/actions/grabUsername";
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";
import {redirect} from "next/navigation";
import {useState} from "react";

export default function UsernameForm({desiredUsername}) {
  const [taken,setTaken] = useState(false);
  async function handleSubmit(formData) {
    const result = await grabUsername(formData);

    setTaken(result === false);
    if (result) {
      redirect('/account?created='+formData.get('username'));
    }
  }
  return (
    <form action={handleSubmit}>
      <h1 className="text-4xl font-bold text-center mb-2">
        Grab your username
      </h1>
      <p className="text-center mb-6 text-gray-500">
        Choose your username
      </p>
      <div className="max-w-xs mx-auto">
        <input
          name="username"
          className="block p-2 mx-auto border w-full mb-2 text-center"
          defaultValue={desiredUsername}
          type="text"
          placeholder="username" />
        {taken && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            This username is taken
          </div>
        )}
        <SubmitButton>
          <span>Claim your username</span>
          <RightIcon />
        </SubmitButton>
      </div>
    </form>
  );
}