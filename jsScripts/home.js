$('document').ready(function(){
    class Categories{
        events(){
            $('.menuCategory').on('click', (e) => {
                console.log(e.currentTarget)
            })
        }
    }

    const categories = new Categories;

    categories.events();
})