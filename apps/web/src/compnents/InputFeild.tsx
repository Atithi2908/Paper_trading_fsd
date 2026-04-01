interface InputFieldProps{
    label:string;
    type?: string;
    value: string;
    onChange: (val:string)=>void ;
}

export function InputField({label,type='text',value,onChange}:InputFieldProps){
    return <div className='p-0'>
        <input className='w-full theme-input px-4 py-3 text-sm sm:text-base bg-panel text-ink' type={type} value={value} placeholder={label} onChange={(e)=> onChange(e.target.value)}/>
        
    </div>
}