import { useFormStatus } from "react-dom"

const FormButton = ({BtnName}: {BtnName: string}) => {
  const { pending, data, action, method } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-0 cursor-pointer disabled:cursor-wait" type="submit"
    >
      { pending ? 'Loading...' : BtnName }
    </button>
  )
}

export default FormButton