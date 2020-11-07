$('document').ready(function(){
    class Categories{
        constructor(){
            this.toggleCat = false
        }

        getSubCatsAndContents(catId, currentElem, catArrow){
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
                    if(xhr.status === 200){
                        const { subCategories, contents } = data;
                        const offsetTop = currentElem.parent().offset();

                        catArrow.css({transform: "rotate(90deg)"});

                        if(subCategories === null && contents === null){
                            currentElem.parent().append(`
                                <div class="noData">
                                    <p>no data temporary error message</p>
                                </div>
                            `)
                        }else{
                            currentElem.parent().append(`<div class="contentsWrap"><?div>`)

                           $.each(subCategories, function(i, subcat){
                               const { subCatId, subCatName } = subcat;
                                console.log(subCatName + " " + i)
                           })
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('.menuCategory').on('click', (e) => {
                const catId = $(e.currentTarget).children("input:first").val();
                const currentElem = $(e.currentTarget);
                const catArrow = $(e.currentTarget).find('.fa-chevron-right');
                this.getSubCatsAndContents(catId, currentElem, catArrow);
            })
        }
    }

    const categories = new Categories;

    categories.events();
})