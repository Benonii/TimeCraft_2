import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,AlertDialogTitle, AlertDialogTrigger,
  } from "../shadcn/AlertDialog";


function DeleteUserAlert({ handleDelete }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger 
                className='ml-7 hover:underline text-red-600 text-base sm:text-lg dark:text-red-500 dark:hover:text-red-400 font-madimi'
            >
                Delete account
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-monomaniac text-xl sm:text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center font-monomaniac text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:gap-4">
                    <AlertDialogCancel className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
                    >
                        Delete account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUserAlert

  