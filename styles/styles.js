export const formModalStyles = {
    dialogSx: {
        "& .MuiDialog-paper": {
            width: "55%",
            height: "100vh",
            borderRadius: 1.5,
            position: 'absolute',
            top: 0,
            right: 0,
        },
    },
    paperProps: {
        margin: 0,
        top: 0,
        right: 0,
        bottom: 0,
    }
}

export const statusStyles = {
    pending: 'bg-yellow',
    canceled: 'bg-red',
    confirmed: 'bg-lightGreen',
};

export const fieldStyles = `appearance-none py-4 border border-[#E6E6E6] rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline`;
export const labelStyles = `block text-black font-[500] mb-2 mt-6`;