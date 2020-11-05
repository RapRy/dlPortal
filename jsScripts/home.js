$('document').ready(function(){
    class Categories{
        getSubCatsAndContents(catId){
            const dataForm = new FormData;

            $.ajax({
                type:'POST',
                url: 'backend/homeFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend:() => {
                    dataForm.append('catId', catId);
                },
                success: (data, textStatus, xhr) => {

                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('.menuCategory').on('click', (e) => {
                const catId = $(e.currentTarget).children("input:first").val();
                this.getSubCatsAndContents(catId);
            })
        }
    }

    const categories = new Categories;

    categories.events();
})