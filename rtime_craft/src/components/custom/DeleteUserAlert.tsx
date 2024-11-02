import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,AlertDialogTitle, AlertDialogTrigger,
  } from "../shadcn/AlertDialog";


function DeleteUserAlert({ handleDelete}) {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="ml-7 hover:underline text-red-600 dark:hover:text-red-500 text-lg">
            Delete account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-300 text-font-monomaniac">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400 text-font-monomaniac">
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-madimi dark:text-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
                className="bg-red-600 dark:bg-red-700 hover:bg-red-500 dark:hover:bg-red-600 dark:text-gray-300 text-white font-madimi"
                onClick={handleDelete}
            >
                Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default DeleteUserAlert

  