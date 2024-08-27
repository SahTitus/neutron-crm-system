export const formModalStyles = (width = "55%") => ({
    dialogSx: {
        "& .MuiDialog-paper": {
            width: width,
            height: "100vh",
            borderRadius: 1.5,
            position: 'absolute',
            top: 0,
            right: 0,
            // responsive styles
            '@media (max-width: 600px)': {
                width: '100%',
            },

        },
    },
    paperProps: {
        margin: 0,
        top: 0,
        right: 0,
        bottom: 0,
    }
});


export const statusStyles = {
    pending: 'bg-yellow',
    canceled: 'bg-red',
    confirmed: 'bg-lightGreen',
};

export const filterCheckboxStyles = {
    color: 'red', // Outline color
    '&.Mui-checked': {
        color: '#F59E0B', // Color of the checkmark
    },
}

export const fieldStyles = `appearance-none py-4 border border-[#E6E6E6] rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline`;
export const labelStyles = `block text-black font-[500] mb-2 mt-6`;

export const emailStyles = `
.container {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px 5px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.top_smText {
    font-size: 18px;
}

h1 {
    color: #333;
}

h2 {
    color: #555;
}

p {
    color: #777;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
}

button {
    background: linear-gradient(to bottom right, #8b5cf6, tomato);
    color: white;
    box-shadow: inset 0 2px 4px 0 rgba(255, 0, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-weight: normal;
    padding: 12px 25px;
    border: none;
    cursor: pointer;
    font-size: 20px;
    border-radius: 5px;
    margin-bottom: 10px;
}

span {
    color: tomato;
}

.bottomInfo {
    margin-top: 50px;
    padding: 15px;
    border-top: 2px solid #ddd;
    display: flex;
    align-items: center;
}

.bottomInfo img {
    max-width: 100px;
    border-radius: 5%;
    margin-right: 15px;
}

.bottomB {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.bottomB .poweredBy,
.bottomB .footer {
    text-align: center;
}

.bottomB .poweredBy {
    margin-bottom: 20px;
}

.link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.link a {
    text-align: center;
    margin-top: 10px;
}

.senderInfo p {
    margin-bottom: -5px;
}

.cta {
    display: inline-block;
    padding: 10px 20px;
    background-color: #0073e6;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin: 20px 0;
    text-align: center;
}

.cta:hover {
    background-color: #005bb5;
}

.footer {
    text-align: center;
    padding: 10px;
    font-size: 14px;
    color: #777;
    border-top: 1px solid #dddddd;
    margin-top: 20px;
}

.custom-3d {
    font-size: 32px;
    text-shadow:
        1px 1px 0 #ffffff,
        2px 2px 0 #0DD983,
        2px 2px 0 #0DD983;
}

.poweredBy {
    display: flex;
    flex-direction: column;
    align-items: center;
}

`